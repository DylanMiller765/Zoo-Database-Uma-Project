import { query } from '../config/database';
import { Ticket } from '../types/ticket.types';

export class TicketModel {
  static async findAll(): Promise<Ticket[]> {
    const sql = 'SELECT * FROM tickets';
    return await query<Ticket[]>(sql);
  }

  static async findById(id: number): Promise<Ticket | null> {
    const sql = 'SELECT * FROM tickets WHERE ticket_id = ?';
    const results = await query<Ticket[]>(sql, [id]);
    return results.length > 0 ? results[0] : null;
  }

  static async create(ticket: Omit<Ticket, 'ticket_id'>): Promise<Ticket> {
    const sql = 'INSERT INTO tickets SET ?';
    const result = await query<any>(sql, [ticket]);
    return { ticket_id: result.insertId, ...ticket };
  }

  static async remove(id: number): Promise<void> {
    const sql = 'DELETE FROM tickets WHERE ticket_id = ?';
    await query(sql, [id]);
  }

  static async findByDate(date: string): Promise<Ticket[]> {
    const sql = 'SELECT * FROM tickets WHERE DATE(visit_date) = ?';
    return await query<Ticket[]>(sql, [date]);
  }
}
