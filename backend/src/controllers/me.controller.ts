import { Request, Response } from 'express';
import { query } from '../config/database';

export class MeController {
  static async summary(req: Request, res: Response) {
    try {
      const account = (req as any).user;
      const customerId = account?.customer_id;
      if (!customerId) {
        return res.status(400).json({ success: false, message: 'Customer not found for this account' });
      }

      // Fetch membership data including dates
      const [membershipRow] = await query<any[]>(
        'SELECT annual_pass, membership_start_date, membership_end_date FROM customers WHERE customer_id = ?',[customerId]
      );

      // Compute actual membership status based on dates
      let membership = { annual_pass: 'no' as 'yes' | 'no', status: 'None' as 'Active' | 'Expired' | 'None' };
      if (membershipRow) {
        const annualPass = membershipRow.annual_pass;
        const endDate = membershipRow.membership_end_date;
        
        if (annualPass === 'yes' && endDate) {
          // Check if membership is expired by comparing with current date in database
          const [dateCheck] = await query<any[]>(
            'SELECT CASE WHEN ? < CURDATE() THEN 1 ELSE 0 END as is_expired',
            [endDate]
          );
          const isExpired = dateCheck?.is_expired === 1;
          
          membership = {
            annual_pass: isExpired ? 'no' : annualPass,
            status: isExpired ? 'Expired' : 'Active'
          };
        } else if (annualPass === 'yes') {
          // Has annual_pass but no end date - treat as active for now
          membership = { annual_pass: annualPass, status: 'Active' };
        } else {
          membership = { annual_pass: 'no', status: 'None' };
        }
      }

      const ticketsUpcoming = await query<any[]>(
        `SELECT ticket_id, ticket_type, price, visit_date, purchase_date
         FROM tickets
         WHERE customer_id = ? AND (visit_date IS NULL OR visit_date >= CURDATE())
         ORDER BY visit_date ASC, purchase_date DESC
         LIMIT 10`,
        [customerId]
      );

      const eventRegsUpcoming = await query<any[]>(
        `SELECT er.registration_id, er.number_of_participants, er.registration_date, er.payment_status,
                e.event_id, e.name as event_name, e.event_date, e.start_time, e.end_time, e.location
         FROM event_registrations er
         JOIN events e ON e.event_id = er.event_id
         WHERE er.customer_id = ? AND (e.event_date IS NULL OR e.event_date >= CURDATE())
         ORDER BY e.event_date ASC, er.registration_date DESC
         LIMIT 10`,
        [customerId]
      );

      const visitsRecent = await query<any[]>(
        `SELECT visit_date, COUNT(*) as tickets_count, COALESCE(SUM(price),0) as total_spent
         FROM tickets
         WHERE customer_id = ? AND visit_date IS NOT NULL AND visit_date < CURDATE()
         GROUP BY visit_date
         ORDER BY visit_date DESC
         LIMIT 10`,
        [customerId]
      );

      res.json({
        success: true,
        data: {
          membership: {
            annual_pass: membership.annual_pass,
            status: membership.status,
            membership_start_date: membershipRow?.membership_start_date || null,
            membership_end_date: membershipRow?.membership_end_date || null,
          },
          ticketsUpcoming,
          eventRegsUpcoming,
          visitsRecent,
        }
      });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e?.message || 'Failed to fetch summary' });
    }
  }

  static async tickets(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.customer_id;
      if (!customerId) return res.status(400).json({ success: false, message: 'Customer not found' });
      const rows = await query<any[]>(
        `SELECT ticket_id, ticket_type, price, visit_date, purchase_date
         FROM tickets WHERE customer_id = ? ORDER BY visit_date DESC, purchase_date DESC`,
        [customerId]
      );
      res.json({ success: true, data: rows });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e?.message || 'Failed to fetch tickets' });
    }
  }

  static async registrations(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.customer_id;
      if (!customerId) return res.status(400).json({ success: false, message: 'Customer not found' });
      const rows = await query<any[]>(
        `SELECT er.registration_id, er.number_of_participants, er.registration_date, er.payment_status,
                e.event_id, e.name as event_name, e.event_date, e.start_time, e.end_time, e.location
         FROM event_registrations er
         JOIN events e ON e.event_id = er.event_id
         WHERE er.customer_id = ?
         ORDER BY e.event_date DESC, er.registration_date DESC`,
        [customerId]
      );
      res.json({ success: true, data: rows });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e?.message || 'Failed to fetch registrations' });
    }
  }

  static async visits(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.customer_id;
      if (!customerId) return res.status(400).json({ success: false, message: 'Customer not found' });
      const rows = await query<any[]>(
        `SELECT visit_date, COUNT(*) as tickets_count, COALESCE(SUM(price),0) as total_spent
         FROM tickets WHERE customer_id = ? AND visit_date IS NOT NULL
         GROUP BY visit_date
         ORDER BY visit_date DESC`,
        [customerId]
      );
      res.json({ success: true, data: rows });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e?.message || 'Failed to fetch visits' });
    }
  }

  static async membership(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.customer_id;
      if (!customerId) return res.status(400).json({ success: false, message: 'Customer not found' });
      
      // Fetch membership data including dates
      const [row] = await query<any[]>(
        'SELECT annual_pass, membership_start_date, membership_end_date FROM customers WHERE customer_id = ?',[customerId]
      );

      if (!row) {
        return res.json({ success: true, data: { annual_pass: 'no', status: 'None' } });
      }

      // Compute actual membership status based on dates
      let status: 'Active' | 'Expired' | 'None' = 'None';
      const annualPass = row.annual_pass;
      const endDate = row.membership_end_date;
      
      if (annualPass === 'yes' && endDate) {
        // Check if membership is expired by comparing with current date in database
        const [dateCheck] = await query<any[]>(
          'SELECT CASE WHEN ? < CURDATE() THEN 1 ELSE 0 END as is_expired',
          [endDate]
        );
        const isExpired = dateCheck?.is_expired === 1;
        status = isExpired ? 'Expired' : 'Active';
      } else if (annualPass === 'yes') {
        // Has annual_pass but no end date - treat as active for now
        status = 'Active';
      }

      res.json({ 
        success: true, 
        data: {
          annual_pass: status === 'Expired' ? 'no' : annualPass,
          status,
          membership_start_date: row.membership_start_date || null,
          membership_end_date: row.membership_end_date || null,
        }
      });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e?.message || 'Failed to fetch membership' });
    }
  }

  static async purchaseMembership(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.customer_id;
      if (!customerId) {
        return res.status(400).json({ success: false, message: 'Customer not found' });
      }

      const { start_date, paymentData, savePaymentMethod } = req.body;

      // Validate payment data is provided
      if (!paymentData || !paymentData.cardNumber || !paymentData.cardholderName) {
        return res.status(400).json({ success: false, message: 'Payment information is required' });
      }

      // If start_date is provided, use it; otherwise use today
      // Calculate end_date as start_date + 1 year
      let actualStartDate: string;
      let actualEndDate: string;
      const membershipPrice = 149.00; // Individual membership price
      let paymentMethodId: number | null = null;

      if (start_date) {
        // Validate that start_date is not in the past
        const [dateCheck] = await query<any[]>(
          'SELECT CASE WHEN ? < CURDATE() THEN 1 ELSE 0 END as is_past',
          [start_date]
        );
        if (dateCheck?.is_past === 1) {
          return res.status(400).json({ success: false, message: 'Start date cannot be in the past' });
        }

        actualStartDate = start_date;
        // Calculate end date
        const [endDateResult] = await query<any[]>(
          'SELECT DATE_ADD(?, INTERVAL 1 YEAR) as end_date',
          [start_date]
        );
        actualEndDate = endDateResult?.end_date;

        // Update membership with provided start date
        await query(
          `UPDATE customers 
           SET annual_pass = 'yes', 
               membership_start_date = ?, 
               membership_end_date = ?
           WHERE customer_id = ?`,
          [actualStartDate, actualEndDate, customerId]
        );
      } else {
        // Use today as start date - get both dates from database for consistency
        const [dateResult] = await query<any[]>(
          'SELECT CURDATE() as start_date, DATE_ADD(CURDATE(), INTERVAL 1 YEAR) as end_date'
        );
        actualStartDate = dateResult?.start_date;
        actualEndDate = dateResult?.end_date;

        await query(
          `UPDATE customers 
           SET annual_pass = 'yes', 
               membership_start_date = CURDATE(), 
               membership_end_date = DATE_ADD(CURDATE(), INTERVAL 1 YEAR)
           WHERE customer_id = ?`,
          [customerId]
        );
      }

      // Save payment method if requested
      if (savePaymentMethod) {
        const { cardNumber, cardholderName, expiryMonth, expiryYear, cvv, billingAddress, billingCity, billingState, billingZip } = paymentData;
        
        // Check if customer already has a payment method
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
            [cardNumber, cardholderName, expiryMonth, expiryYear, cvv || null, billingAddress, billingCity, billingState, billingZip, customerId]
          );
          paymentMethodId = existing.payment_method_id;
        } else {
          // Create new payment method
          const result = await query<any>(
            `INSERT INTO customer_payment_methods 
             (customer_id, card_number, cardholder_name, expiry_month, expiry_year, cvv, 
              billing_address, billing_city, billing_state, billing_zip)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [customerId, cardNumber, cardholderName, expiryMonth, expiryYear, cvv || null, billingAddress, billingCity, billingState, billingZip]
          );
          paymentMethodId = result.insertId;
        }
      }

      // Record purchase in history table
      await query(
        `INSERT INTO membership_purchases
         (customer_id, purchase_date, start_date, end_date, price, payment_method, payment_method_id)
         VALUES (?, NOW(), ?, ?, ?, 'credit', ?)`,
        [customerId, actualStartDate, actualEndDate, membershipPrice, paymentMethodId]
      );

      // Fetch updated membership data
      const [updatedRow] = await query<any[]>(
        'SELECT annual_pass, membership_start_date, membership_end_date FROM customers WHERE customer_id = ?',
        [customerId]
      );

      res.json({
        success: true,
        message: 'Membership purchased successfully',
        data: {
          annual_pass: updatedRow?.annual_pass || 'yes',
          status: 'Active',
          membership_start_date: updatedRow?.membership_start_date || null,
          membership_end_date: updatedRow?.membership_end_date || null,
        }
      });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e?.message || 'Failed to purchase membership' });
    }
  }

  static async savePaymentMethod(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.customer_id;
      if (!customerId) {
        return res.status(400).json({ success: false, message: 'Customer not found' });
      }

      const { cardNumber, cardholderName, expiryMonth, expiryYear, cvv, billingAddress, billingCity, billingState, billingZip } = req.body;

      if (!cardNumber || !cardholderName || !expiryMonth || !expiryYear) {
        return res.status(400).json({ success: false, message: 'Missing required payment information' });
      }

      // Check if customer already has a payment method
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
          [cardNumber, cardholderName, expiryMonth, expiryYear, cvv || null, billingAddress, billingCity, billingState, billingZip, customerId]
        );
      } else {
        // Create new payment method
        await query(
          `INSERT INTO customer_payment_methods 
           (customer_id, card_number, cardholder_name, expiry_month, expiry_year, cvv, 
            billing_address, billing_city, billing_state, billing_zip)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [customerId, cardNumber, cardholderName, expiryMonth, expiryYear, cvv || null, billingAddress, billingCity, billingState, billingZip]
        );
      }

      res.json({
        success: true,
        message: 'Payment method saved successfully'
      });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e?.message || 'Failed to save payment method' });
    }
  }

  static async getPaymentMethod(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.customer_id;
      if (!customerId) {
        return res.status(400).json({ success: false, message: 'Customer not found' });
      }

      const [paymentMethod] = await query<any[]>(
        'SELECT payment_method_id, card_number, cardholder_name, expiry_month, expiry_year, billing_address, billing_city, billing_state, billing_zip, created_at FROM customer_payment_methods WHERE customer_id = ?',
        [customerId]
      );

      if (!paymentMethod) {
        return res.json({ success: true, data: null });
      }

      // Only return last 4 digits for security
      const lastFour = paymentMethod.card_number.slice(-4);
      res.json({
        success: true,
        data: {
          ...paymentMethod,
          card_number: `**** **** **** ${lastFour}`,
        }
      });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e?.message || 'Failed to get payment method' });
    }
  }

  static async deletePaymentMethod(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.customer_id;
      if (!customerId) {
        return res.status(400).json({ success: false, message: 'Customer not found' });
      }

      await query(
        'DELETE FROM customer_payment_methods WHERE customer_id = ?',
        [customerId]
      );

      res.json({
        success: true,
        message: 'Payment method deleted successfully'
      });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e?.message || 'Failed to delete payment method' });
    }
  }

  static async toggleAutoRenew(req: Request, res: Response) {
    try {
      const customerId = (req as any).user?.customer_id;
      if (!customerId) {
        return res.status(400).json({ success: false, message: 'Customer not found' });
      }

      const { autoRenew } = req.body;

      if (typeof autoRenew !== 'boolean') {
        return res.status(400).json({ success: false, message: 'autoRenew must be a boolean' });
      }

      // Check if customer has a saved payment method if enabling auto-renew
      if (autoRenew) {
        const [paymentMethod] = await query<any[]>(
          'SELECT payment_method_id FROM customer_payment_methods WHERE customer_id = ?',
          [customerId]
        );

        if (!paymentMethod) {
          return res.status(400).json({ 
            success: false, 
            message: 'Please save a payment method before enabling auto-renewal' 
          });
        }
      }

      await query(
        'UPDATE customers SET membership_auto_renew = ? WHERE customer_id = ?',
        [autoRenew, customerId]
      );

      res.json({
        success: true,
        message: `Auto-renewal ${autoRenew ? 'enabled' : 'disabled'}`,
        data: { autoRenew }
      });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e?.message || 'Failed to toggle auto-renewal' });
    }
  }
}

export default MeController;
