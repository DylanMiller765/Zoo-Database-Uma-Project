import { DonationModel } from '../models/donation.model';
import { query, getCurrentDateTime } from '../config/database';
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

    // Check if any membership has auto-renewal enabled
    const hasAutoRenewMembership = checkoutData.items.some(
      item => item.item_type === 'membership' && 
              (item.metadata?.auto_renew !== undefined ? item.metadata.auto_renew : true)
    );

    // If auto-renewal is enabled, ensure payment method will be saved
    if (hasAutoRenewMembership) {
      // Check if customer already has a payment method
      const [existingPayment] = await query<any[]>(
        'SELECT payment_method_id FROM customer_payment_methods WHERE customer_id = ?',
        [customerId]
      );

      // If no existing payment method and not saving one now, throw error
      if (!existingPayment && (!checkoutData.save_payment_method || !checkoutData.payment_data)) {
        throw new Error('A payment method must be saved to enable auto-renewal. Please check "Save payment method" during checkout.');
      }
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
          await this.createMembership(item, customerId, checkoutData.payment_method, checkoutData.payment_data, checkoutData.save_payment_method);
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
    const currentDateTime = getCurrentDateTime();

    for (let i = 0; i < item.quantity; i++) {
      await query(
        `INSERT INTO tickets (customer_id, visit_date, ticket_type, price, payment_method, purchase_date)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [customerId, metadata.visit_date, metadata.ticket_type, item.unit_price, paymentMethod, currentDateTime]
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
    const totalAmount = item.unit_price * (metadata.participants || 1);
    const currentDateTime = getCurrentDateTime();

    await query(
      `INSERT INTO event_registrations (event_id, customer_id, number_of_participants, total_amount, payment_status, registration_date)
       VALUES (?, ?, ?, ?, 'paid', ?)`,
      [metadata.event_id || item.item_id, customerId, metadata.participants || 1, totalAmount, currentDateTime]
    );
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
    const currentDateTime = getCurrentDateTime();

    await query(
      `INSERT INTO cafe_sales (cafe_id, transaction_id, customer_id, employee_id, item_id, quantity, line_total, sale_timestamp, status)
       VALUES (?, ?, ?, NULL, ?, ?, ?, ?, 'completed')`,
      [cafeId, transactionId, customerId, item.item_id, item.quantity, lineTotal, currentDateTime]
    );
  }

  /**
   * Create gift shop sale and deplete stock
   * Validates stock availability before processing
   */
  private static async createGiftShopSale(
    item: CheckoutCartItem,
    customerId: number,
    paymentMethod: 'credit' | 'debit'
  ): Promise<void> {
    const metadata = item.metadata || {};
    const giftShopId = metadata.gift_shop_id || 1;
    const totalAmount = item.unit_price * item.quantity;
    const currentDateTime = getCurrentDateTime();

    // Validate item exists and check stock availability
    const [itemData] = await query<any[]>(
      `SELECT item_id, quantity_in_stock, name FROM gift_shop_items
       WHERE item_id = ? AND deleted_at IS NULL`,
      [item.item_id]
    );

    if (!itemData) {
      throw new Error(`Gift shop item #${item.item_id} not found or has been deleted`);
    }

    if (itemData.quantity_in_stock <= 0) {
      throw new Error(`"${itemData.name}" is out of stock`);
    }

    if (itemData.quantity_in_stock < item.quantity) {
      throw new Error(`Only ${itemData.quantity_in_stock} of "${itemData.name}" available (requested: ${item.quantity})`);
    }

    // Create transaction
    const transactionResult = await query<any>(
      `INSERT INTO gift_shop_sales_transactions (gift_shop_id, customer_id, employee_id, total_amount, payment_method, sale_date, status)
       VALUES (?, ?, NULL, ?, ?, ?, 'completed')`,
      [giftShopId, customerId, totalAmount, paymentMethod, currentDateTime]
    );

    const transactionId = transactionResult.insertId;

    // Create sale item
    await query(
      `INSERT INTO gift_shop_sale_items (transaction_id, item_id, quantity, unit_price)
       VALUES (?, ?, ?, ?)`,
      [transactionId, item.item_id, item.quantity, item.unit_price]
    );

    // Deplete stock - reduce quantity_in_stock by purchased quantity
    // This is atomic in MySQL and prevents race conditions
    await query(
      `UPDATE gift_shop_items SET quantity_in_stock = quantity_in_stock - ? WHERE item_id = ? AND quantity_in_stock >= ?`,
      [item.quantity, item.item_id, item.quantity]
    );

    // Verify the update was successful (in case another customer bought the last item)
    const [updatedItem] = await query<any[]>(
      `SELECT quantity_in_stock FROM gift_shop_items WHERE item_id = ?`,
      [item.item_id]
    );

    if (updatedItem.quantity_in_stock < 0) {
      throw new Error(`"${itemData.name}" sold out - unable to complete purchase. Please remove from cart and try again.`);
    }
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
    const currentDateTime = getCurrentDateTime();

    await DonationModel.create({
      customer_id: customerId,
      amount: item.unit_price,
      message: metadata.donation_message,
      payment_method: paymentMethod,
    }, currentDateTime);
  }

  /**
   * Create membership purchase record
   */
  private static async createMembership(
    item: CheckoutCartItem,
    customerId: number,
    paymentMethod: 'credit' | 'debit',
    paymentData?: any,
    shouldSavePaymentMethod: boolean = false
  ): Promise<void> {
    const metadata = item.metadata || {};
    const membershipPrice = 149.00; // Individual membership price
    let paymentMethodId: number | null = null;

    // Check if customer already has an active membership
    const [existingMembership] = await query<any[]>(
      `SELECT membership_end_date, annual_pass 
       FROM customers 
       WHERE customer_id = ? AND annual_pass = 'yes' AND membership_end_date >= CURDATE()`,
      [customerId]
    );

    if (existingMembership) {
      // Check if membership expires within 30 days
      const [dateCheck] = await query<any[]>(
        `SELECT DATEDIFF(membership_end_date, CURDATE()) as days_until_expiry
         FROM customers 
         WHERE customer_id = ?`,
        [customerId]
      );

      const daysUntilExpiry = dateCheck?.days_until_expiry || 0;

      if (daysUntilExpiry > 30) {
        throw new Error(`You already have an active membership that expires in ${daysUntilExpiry} days. You can only renew your membership within 30 days of expiration.`);
      }
    }

    // Save payment method only if explicitly requested by user
    if (shouldSavePaymentMethod && paymentData) {
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

    // If auto-renewal is enabled, ensure payment method exists
    if (autoRenew) {
      // Check if payment method was just saved or already exists
      if (!paymentMethodId) {
        // Check if customer already has a saved payment method
        const [existingPayment] = await query<any[]>(
          'SELECT payment_method_id FROM customer_payment_methods WHERE customer_id = ?',
          [customerId]
        );
        
        if (!existingPayment) {
          throw new Error('A payment method must be saved to enable auto-renewal. Please check "Save payment method" during checkout.');
        }
        paymentMethodId = existingPayment.payment_method_id;
      }
    } else {
      // If auto-renewal is off and payment method wasn't saved, try to use existing one for the purchase record
      if (!paymentMethodId && paymentData) {
        const [existingPayment] = await query<any[]>(
          'SELECT payment_method_id FROM customer_payment_methods WHERE customer_id = ?',
          [customerId]
        );
        if (existingPayment) {
          paymentMethodId = existingPayment.payment_method_id;
        }
      }
    }

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
    const currentDateTime = getCurrentDateTime();
    await query(
      `INSERT INTO membership_purchases
       (customer_id, purchase_date, start_date, end_date, price, payment_method, payment_method_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [customerId, currentDateTime, actualStartDate, actualEndDate, membershipPrice, paymentMethod, paymentMethodId]
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

