import { query } from '../config/database';
import { Ticket } from '../types/ticket.types';

export class TicketModel {
  static async findAll(): Promise<Ticket[]> {
    const sql = 'SELECT * FROM tickets WHERE deleted_at IS NULL';
    return await query<Ticket[]>(sql);
  }

  static async findById(id: number): Promise<Ticket | null> {
    const sql = 'SELECT * FROM tickets WHERE ticket_id = ? AND deleted_at IS NULL';
    const results = await query<Ticket[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async create(ticket: Omit<Ticket, 'ticket_id'>): Promise<Ticket> {
    // Remove any fields that shouldn't be inserted (ticket_id, purchase_date is auto-generated)
    const { ticket_id, purchase_date, ...insertData } = ticket as any;

    // Use explicit column names for better error handling
    const sql = `INSERT INTO tickets (customer_id, visit_date, ticket_type, price, payment_method)
                 VALUES (?, ?, ?, ?, ?)`;

    const result = await query<any>(sql, [
      insertData.customer_id || null,
      insertData.visit_date,
      insertData.ticket_type,
      insertData.price,
      insertData.payment_method || 'online'
    ]);

    return {
      ticket_id: result.insertId,
      customer_id: insertData.customer_id || null,
      visit_date: insertData.visit_date,
      ticket_type: insertData.ticket_type,
      price: insertData.price,
      payment_method: insertData.payment_method || 'online',
      purchase_date: new Date().toISOString()
    } as Ticket;
  }

  static async remove(id: number): Promise<void> {
    const sql = 'UPDATE tickets SET deleted_at = NOW() WHERE ticket_id = ?';
    await query(sql, [id]);
  }

  static async findByDate(date: string): Promise<Ticket[]> {
    const sql = 'SELECT * FROM tickets WHERE DATE(visit_date) = ? AND deleted_at IS NULL';
    return await query<Ticket[]>(sql, [date]);
  }
}
