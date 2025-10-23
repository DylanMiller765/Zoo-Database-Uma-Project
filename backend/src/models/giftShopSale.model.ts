import { query } from '../config/database';
import { GiftShopSale, GiftShopSaleItem } from '../types/giftShopSale.types';

export class GiftShopSaleModel {
  static async create(sale: GiftShopSale): Promise<GiftShopSale> {
    // This should be a transaction
    const connection = await (query as any).getConnection();
    await connection.beginTransaction();

    try {
      const { items, ...saleData } = sale;
      const saleSql = 'INSERT INTO gift_shop_sales_transactions SET ?';
      const saleResult = await connection.query(saleSql, [saleData]);
      const transactionId = saleResult.insertId;

      const itemPromises = items.map(item => {
        const itemSql = 'INSERT INTO gift_shop_sale_items SET ?';
        return connection.query(itemSql, [{ ...item, transaction_id: transactionId }]);
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

  static async findById(id: number): Promise<GiftShopSale | null> {
    const saleSql = 'SELECT * FROM gift_shop_sales_transactions WHERE transaction_id = ?';
    const saleResults = await query<GiftShopSale[]>(saleSql, [id]);

    if (saleResults.length === 0) {
      return null;
    }

    const itemsSql = 'SELECT * FROM gift_shop_sale_items WHERE transaction_id = ?';
    const items = await query<GiftShopSaleItem[]>(itemsSql, [id]);

    return { ...saleResults[0], items };
  }

  static async findByDate(date: string): Promise<GiftShopSale[]> {
    const sql = 'SELECT * FROM gift_shop_sales_transactions WHERE DATE(sale_date) = ?';
    return await query<GiftShopSale[]>(sql, [date]);
  }

  // process_gift_return would be a complex operation involving stock updates and transaction marking.
  // For now, a simple delete is implemented.
  static async remove(id: number): Promise<void> {
    const sql = 'DELETE FROM gift_shop_sales_transactions WHERE transaction_id = ?';
    await query(sql, [id]);
  }
}
