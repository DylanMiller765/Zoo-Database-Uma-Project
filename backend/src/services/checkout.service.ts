import { DonationModel } from '../models/donation.model';
import { query } from '../config/database';
import { CheckoutRequest, CheckoutResponse, CheckoutCartItem } from '../types/checkout.types';

export class CheckoutService {
  /**
   * Process checkout - creates records in existing tables from client-side cart
   */
  static async processCheckout(
    customerId: number,
    checkoutData: CheckoutRequest
  ): Promise<CheckoutResponse> {
    if (!checkoutData.items || checkoutData.items.length === 0) {
      throw new Error('Cart is empty');
    }

    // Save payment method if requested
    if (checkoutData.save_payment_method && checkoutData.payment_data) {
      await this.savePaymentMethod(customerId, checkoutData.payment_data);
    }

    // Track counts for response
    const summary = {
      tickets: 0,
      events: 0,
      cafe_items: 0,
      gift_shop_items: 0,
      donations: 0,
      memberships: 0,
    };

    // Process each cart item
    for (const item of checkoutData.items) {
      switch (item.item_type) {
        case 'ticket':
          await this.createTicketRecords(item, customerId, checkoutData.payment_method);
          summary.tickets += item.quantity;
          break;

        case 'event':
          console.log('[CheckoutService] Processing event item:', item);
          await this.createEventRegistration(item, customerId);
          summary.events++;
          break;

        case 'cafe_item':
          await this.createCafeSale(item, customerId);
          summary.cafe_items += item.quantity;
          break;

        case 'gift_shop_item':
          await this.createGiftShopSale(item, customerId, checkoutData.payment_method);
          summary.gift_shop_items += item.quantity;
          break;

        case 'donation':
          await this.createDonation(item, customerId, checkoutData.payment_method);
          summary.donations++;
          break;

        case 'membership':
          await this.createMembership(item, customerId, checkoutData.payment_method, checkoutData.payment_data);
          summary.memberships++;
          break;

        default:
          console.error(`Unknown item type: ${item.item_type}`);
      }
    }

    // Calculate total
    const totalAmount = checkoutData.items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );

    return {
      success: true,
      summary,
      total_amount: totalAmount,
      message: 'Order completed successfully',
    };
  }

  /**
   * Create ticket records (one per quantity)
   */
  private static async createTicketRecords(
    item: CheckoutCartItem,
    customerId: number,
    paymentMethod: 'credit' | 'debit'
  ): Promise<void> {
    const metadata = item.metadata || {};

    for (let i = 0; i < item.quantity; i++) {
      await query(
        `INSERT INTO tickets (customer_id, visit_date, ticket_type, price, payment_method)
         VALUES (?, ?, ?, ?, ?)`,
        [customerId, metadata.visit_date, metadata.ticket_type, item.unit_price, paymentMethod]
      );
    }
  }

  /**
   * Create event registration
   */
  private static async createEventRegistration(
    item: CheckoutCartItem,
    customerId: number
  ): Promise<void> {
    const metadata = item.metadata || {};
    const eventId = metadata.event_id || item.item_id;
    const participants = metadata.participants || item.quantity || 1;
    const totalAmount = item.unit_price * participants;

    console.log('[CheckoutService] Creating event registration:', {
      eventId,
      customerId,
      participants,
      totalAmount,
      item_id: item.item_id,
      metadata
    });

    if (!eventId) {
      throw new Error('Event ID is required for event registration');
    }

    const result = await query<any>(
      `INSERT INTO event_registrations (event_id, customer_id, number_of_participants, total_amount, payment_status)
       VALUES (?, ?, ?, ?, 'paid')`,
      [eventId, customerId, participants, totalAmount]
    );

    console.log('[CheckoutService] Event registration created:', {
      registrationId: result.insertId,
      eventId,
      customerId
    });
  }

  /**
   * Create cafe sale
   */
  private static async createCafeSale(
    item: CheckoutCartItem,
    customerId: number
  ): Promise<void> {
    const metadata = item.metadata || {};
    const cafeId = metadata.cafe_id || 1;
    const transactionId = `CAFE-WEB-${customerId}-${Date.now()}`;
    const lineTotal = item.unit_price * item.quantity;

    console.log('[CheckoutService] Creating cafe sale:', {
      cafeId,
      transactionId,
      customerId,
      item_id: item.item_id,
      quantity: item.quantity,
      lineTotal,
    });

    const result = await query<any>(
      `INSERT INTO cafe_sales (cafe_id, transaction_id, customer_id, employee_id, item_id, quantity, line_total, status)
       VALUES (?, ?, ?, NULL, ?, ?, ?, 'completed')`,
      [cafeId, transactionId, customerId, item.item_id, item.quantity, lineTotal]
    );

    console.log('[CheckoutService] Cafe sale created:', {
      saleId: result.insertId,
      customerId,
      item_id: item.item_id,
    });
  }

  /**
   * Create gift shop sale
   */
  private static async createGiftShopSale(
    item: CheckoutCartItem,
    customerId: number,
    paymentMethod: 'credit' | 'debit'
  ): Promise<void> {
    const metadata = item.metadata || {};
    const giftShopId = metadata.gift_shop_id || 1;
    const totalAmount = item.unit_price * item.quantity;

    console.log('[CheckoutService] Creating gift shop sale:', {
      giftShopId,
      customerId,
      item_id: item.item_id,
      quantity: item.quantity,
      totalAmount,
      paymentMethod,
    });

    // Create transaction
    const transactionResult = await query<any>(
      `INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, total_amount, payment_method, status)
       VALUES (?, ?, NULL, ?, ?, 'completed')`,
      [giftShopId, customerId, totalAmount, paymentMethod]
    );

    const transactionId = transactionResult.insertId;

    console.log('[CheckoutService] Gift shop transaction created:', {
      transactionId,
      customerId,
    });

    // Create sale item
    await query(
      `INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price)
       VALUES (?, ?, ?, ?)`,
      [transactionId, item.item_id, item.quantity, item.unit_price]
    );

    console.log('[CheckoutService] Gift shop sale item created:', {
      transactionId,
      item_id: item.item_id,
      quantity: item.quantity,
    });
  }

  /**
   * Create donation record
   */
  private static async createDonation(
    item: CheckoutCartItem,
    customerId: number,
    paymentMethod: 'credit' | 'debit'
  ): Promise<void> {
    const metadata = item.metadata || {};

    await DonationModel.create({
      customer_id: customerId,
      amount: item.unit_price,
      message: metadata.donation_message,
      payment_method: paymentMethod,
    });
  }

  /**
   * Create membership purchase record
   */
  private static async createMembership(
    item: CheckoutCartItem,
    customerId: number,
    paymentMethod: 'credit' | 'debit',
    paymentData?: any
  ): Promise<void> {
    const metadata = item.metadata || {};
    const membershipPrice = 149.00; // Individual membership price
    let paymentMethodId: number | null = null;

    // Save payment method if provided
    if (paymentData) {
      const [existing] = await query<any[]>(
        'SELECT payment_method_id FROM customer_payment_methods WHERE customer_id = ?',
        [customerId]
      );

      if (existing) {
        // Update existing payment method
        await query(
          `UPDATE customer_payment_methods 
           SET card_number = ?, cardholder_name = ?, expiry_month = ?, expiry_year = ?, 
               cvv = ?, billing_address = ?, billing_city = ?, billing_state = ?, billing_zip = ?,
               updated_at = NOW()
           WHERE customer_id = ?`,
          [
            paymentData.cardNumber,
            paymentData.cardholderName,
            paymentData.expiryMonth,
            paymentData.expiryYear,
            paymentData.cvv || null,
            paymentData.billingAddress,
            paymentData.billingCity,
            paymentData.billingState,
            paymentData.billingZip,
            customerId,
          ]
        );
        paymentMethodId = existing.payment_method_id;
      } else {
        // Create new payment method
        const result = await query<any>(
          `INSERT INTO customer_payment_methods 
           (customer_id, card_number, cardholder_name, expiry_month, expiry_year, cvv, 
            billing_address, billing_city, billing_state, billing_zip)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            customerId,
            paymentData.cardNumber,
            paymentData.cardholderName,
            paymentData.expiryMonth,
            paymentData.expiryYear,
            paymentData.cvv || null,
            paymentData.billingAddress,
            paymentData.billingCity,
            paymentData.billingState,
            paymentData.billingZip,
          ]
        );
        paymentMethodId = result.insertId;
      }
    }

    // Calculate membership dates (start today, end 1 year from today)
    const [dateResult] = await query<any[]>(
      'SELECT CURDATE() as start_date, DATE_ADD(CURDATE(), INTERVAL 1 YEAR) as end_date'
    );
    const actualStartDate = dateResult?.start_date;
    const actualEndDate = dateResult?.end_date;

    // Get auto-renewal preference from metadata (default to TRUE if not specified)
    const autoRenew = metadata.auto_renew !== undefined ? metadata.auto_renew : true;

    // Update customer membership
    await query(
      `UPDATE customers 
       SET annual_pass = 'yes', 
           membership_start_date = CURDATE(), 
           membership_end_date = DATE_ADD(CURDATE(), INTERVAL 1 YEAR),
           membership_auto_renew = ?
       WHERE customer_id = ?`,
      [autoRenew, customerId]
    );

    // Record purchase in history table
    await query(
      `INSERT INTO membership_purchases 
       (customer_id, purchase_date, start_date, end_date, price, payment_method, payment_method_id)
       VALUES (?, NOW(), ?, ?, ?, ?, ?)`,
      [customerId, actualStartDate, actualEndDate, membershipPrice, paymentMethod, paymentMethodId]
    );
  }

  /**
   * Save payment method for customer
   * 
   * @SECURITY_RISK - This method stores raw, unencrypted credit card information
   * including the CVV. This is a major security vulnerability and is not PCI compliant.
   * This is for demonstration purposes only in a student project.
   * In a real-world application, use a secure payment gateway like Stripe or Braintree.
   */
  private static async savePaymentMethod(customerId: number, paymentData: any): Promise<void> {
    // Check if payment method already exists
    const [existing] = await query<any[]>(
      'SELECT payment_method_id FROM customer_payment_methods WHERE customer_id = ?',
      [customerId]
    );

    if (existing) {
      // Update existing
      await query(
        `UPDATE customer_payment_methods
         SET card_number = ?, cardholder_name = ?, expiry_month = ?, expiry_year = ?,
             cvv = ?, billing_address = ?, billing_city = ?, billing_state = ?, billing_zip = ?
         WHERE customer_id = ?`,
        [
          paymentData.cardNumber,
          paymentData.cardholderName,
          paymentData.expiryMonth,
          paymentData.expiryYear,
          paymentData.cvv,
          paymentData.billingAddress,
          paymentData.billingCity,
          paymentData.billingState,
          paymentData.billingZip,
          customerId,
        ]
      );
    } else {
      // Create new
      await query(
        `INSERT INTO customer_payment_methods
         (customer_id, card_number, cardholder_name, expiry_month, expiry_year, cvv, billing_address, billing_city, billing_state, billing_zip)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          customerId,
          paymentData.cardNumber,
          paymentData.cardholderName,
          paymentData.expiryMonth,
          paymentData.expiryYear,
          paymentData.cvv,
          paymentData.billingAddress,
          paymentData.billingCity,
          paymentData.billingState,
          paymentData.billingZip,
        ]
      );
    }
  }
}
