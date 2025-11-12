import { query, pool } from '../config/database';
import { CafeSale, CafeSaleItem } from '../types/cafeSale.types';
import { randomUUID } from 'crypto';

export class CafeSaleModel {
  static async create(sale: Omit<CafeSale, 'sale_id' | 'transaction_id'>): Promise<CafeSale> {
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      const transactionId = randomUUID();
      const itemPromises = sale.items.map(item => {
        const sql = 'INSERT INTO cafe_sales SET ?';
        const saleData = {
          cafe_id: sale.cafe_id,
          transaction_id: transactionId,
          customer_id: sale.customer_id,
          employee_id: sale.employee_id,
          item_id: item.item_id,
          quantity: item.quantity,
          line_total: item.line_total
        };
        return connection.query(sql, [saleData]);
      });

      await Promise.all(itemPromises);

      await connection.commit();
      connection.release();

      return { ...sale, transaction_id: transactionId };
    } catch (error) {
      await connection.rollback();
      connection.release();
      throw error;
    }
  }

  static async findByTransactionId(transactionId: string): Promise<CafeSale | null> {
    const sql = 'SELECT * FROM cafe_sales WHERE transaction_id = ?';
    const results = await query<any[]>(sql, [transactionId]);

    if (results.length === 0) {
      return null;
    }

    const sale: CafeSale = {
      transaction_id: results[0].transaction_id,
      cafe_id: results[0].cafe_id,
      customer_id: results[0].customer_id,
      employee_id: results[0].employee_id,
      sale_timestamp: results[0].sale_timestamp,
      items: results.map(row => ({
        item_id: row.item_id,
        quantity: row.quantity,
        line_total: row.line_total
      }))
    };

    return sale;
  }

  static async findByDateAndCafe(date: string, cafeId: number): Promise<any[]> {
    const sql = 'SELECT * FROM cafe_sales WHERE DATE(sale_timestamp) = ? AND cafe_id = ?';
    return await query<any[]>(sql, [date, cafeId]);
  }

  static async remove(transactionId: string): Promise<void> {
    const sql = 'UPDATE cafe_sales SET status = "returned" WHERE transaction_id = ?';
    await query(sql, [transactionId]);
  }
}
