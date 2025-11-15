import { Donation } from '../types/donation.types';
import { EventRegistration } from '../types/eventRegistration.types';
import { GiftShopSale } from '../types/giftShopSale.types';
import { CafeSale } from '../types/cafeSale.types';
import { Ticket } from '../types/ticket.types';
import { UnifiedTransaction } from '../types/transaction.types';
import { query } from '../config/database';

export class TransactionService {
  static async getAll(): Promise<UnifiedTransaction[]> {
    const donations = await this.getDonations();
    const eventRegistrations = await this.getEventRegistrations();
    const giftShopSales = await this.getGiftShopSales();
    const cafeSales = await this.getCafeSales();
    const ticketSales = await this.getTicketSales();

    return [
      ...donations,
      ...eventRegistrations,
      ...giftShopSales,
      ...cafeSales,
      ...ticketSales,
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  private static async getDonations(): Promise<UnifiedTransaction[]> {
    const sql = `
      SELECT
        d.donation_id,
        d.donation_date,
        d.amount,
        c.first_name,
        c.last_name
      FROM donations d
      LEFT JOIN customers c ON d.customer_id = c.customer_id
    `;
    const rows = await query<any[]>(sql);
    return rows.map(row => ({
      id: `donation-${row.donation_id}`,
      type: 'Donation',
      date: row.donation_date,
      total: parseFloat(row.amount),
      customerName: `${row.first_name} ${row.last_name}`,
      details: {},
    }));
  }

  private static async getEventRegistrations(): Promise<UnifiedTransaction[]> {
    const sql = `
      SELECT
        er.registration_id,
        er.registration_date,
        er.number_of_participants,
        er.total_amount,
        c.first_name,
        c.last_name
      FROM event_registrations er
      LEFT JOIN customers c ON er.customer_id = c.customer_id
      WHERE er.deleted_at IS NULL
    `;
    const rows = await query<any[]>(sql);
    return rows.map(row => ({
      id: `event-${row.registration_id}`,
      type: 'Event',
      date: row.registration_date,
      total: parseFloat(row.total_amount),
      customerName: row.first_name ? `${row.first_name} ${row.last_name}` : 'Walk-in Customer',
      details: {
        participants: row.number_of_participants,
      },
    }));
  }

  private static async getGiftShopSales(): Promise<UnifiedTransaction[]> {
    const sql = `
      SELECT
        t.transaction_id,
        t.sale_date,
        t.total_amount,
        c.first_name,
        c.last_name,
        e.first_name as emp_first_name,
        e.last_name as emp_last_name
      FROM gift_shop_sales_transactions t
      LEFT JOIN customers c ON t.customer_id = c.customer_id
      LEFT JOIN employees e ON t.employee_id = e.employee_id
    `;
    const rows = await query<any[]>(sql);
    return rows.map(row => ({
      id: `giftshop-${row.transaction_id}`,
      type: 'Gift Shop',
      date: row.sale_date,
      total: parseFloat(row.total_amount),
      customerName: row.first_name ? `${row.first_name} ${row.last_name}` : 'N/A',
      employeeName: row.emp_first_name ? `${row.emp_first_name} ${row.emp_last_name}` : 'N/A',
      details: {},
    }));
  }

  private static async getCafeSales(): Promise<UnifiedTransaction[]> {
    const sql = `
      SELECT
        transaction_id,
        sale_timestamp,
        SUM(line_total) as total,
        customer_id,
        employee_id
      FROM cafe_sales
      GROUP BY transaction_id, sale_timestamp, customer_id, employee_id
    `;
    const rows = await query<any[]>(sql);

    // This is inefficient, but for the sake of simplicity for now...
    const populatedRows = await Promise.all(rows.map(async row => {
      let customerName = 'N/A';
      if (row.customer_id) {
        const [c] = await query<any[]>('SELECT first_name, last_name FROM customers WHERE customer_id = ?', [row.customer_id]);
        if(c) customerName = `${c.first_name} ${c.last_name}`;
      }
      let employeeName = 'N/A';
      if (row.employee_id) {
        const [e] = await query<any[]>('SELECT first_name, last_name FROM employees WHERE employee_id = ?', [row.employee_id]);
        if(e) employeeName = `${e.first_name} ${e.last_name}`;
      }
      return { ...row, customerName, employeeName };
    }));

    return populatedRows.map(row => ({
      id: `cafe-${row.transaction_id}`,
      type: 'Cafe',
      date: row.sale_timestamp,
      total: parseFloat(row.total),
      customerName: row.customerName,
      employeeName: row.employeeName,
      details: {},
    }));
  }

  private static async getTicketSales(): Promise<UnifiedTransaction[]> {
    const sql = `
      SELECT
        t.ticket_id,
        t.purchase_date,
        t.price,
        c.first_name,
        c.last_name
      FROM tickets t
      LEFT JOIN customers c ON t.customer_id = c.customer_id
      WHERE t.deleted_at IS NULL
    `;
    const rows = await query<any[]>(sql);
    return rows.map(row => ({
      id: `ticket-${row.ticket_id}`,
      type: 'Ticket',
      date: row.purchase_date,
      total: parseFloat(row.price),
      customerName: row.first_name ? `${row.first_name} ${row.last_name}` : 'N/A',
      details: {},
    }));
  }
}
