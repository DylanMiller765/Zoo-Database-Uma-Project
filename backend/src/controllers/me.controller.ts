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

      const [membership] = await query<any[]>(
        'SELECT annual_pass FROM customers WHERE customer_id = ?',[customerId]
      );

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
          membership: membership || { annual_pass: 'no' },
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
      const [row] = await query<any[]>(
        'SELECT annual_pass FROM customers WHERE customer_id = ?',[customerId]
      );
      res.json({ success: true, data: row || { annual_pass: 'no' } });
    } catch (e: any) {
      res.status(500).json({ success: false, message: e?.message || 'Failed to fetch membership' });
    }
  }
}

export default MeController;
