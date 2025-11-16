import { query } from '../config/database';
import { CustomerOrder, OrderDetails, OrderItem } from '../types/order.types';

export class OrderModel {
  /**
   * Create a new order
   */
  static async create(order: Omit<CustomerOrder, 'order_id' | 'order_date' | 'status'>): Promise<number> {
    const result = await query<any>(
      `INSERT INTO customer_orders (customer_id, total_amount, payment_method, payment_method_id, status)
       VALUES (?, ?, ?, ?, 'completed')`,
      [order.customer_id, order.total_amount, order.payment_method, order.payment_method_id || null]
    );

    return result.insertId;
  }

  /**
   * Get order by ID
   */
  static async findById(orderId: number): Promise<CustomerOrder | null> {
    const [order] = await query<CustomerOrder[]>(
      'SELECT * FROM customer_orders WHERE order_id = ?',
      [orderId]
    );

    return order || null;
  }

  /**
   * Get order with full details (items + customer info)
   */
  static async getOrderDetails(orderId: number): Promise<OrderDetails | null> {
    const [order] = await query<any[]>(
      `SELECT
        co.*,
        CONCAT(c.first_name, ' ', c.last_name) as customer_name,
        c.email as customer_email
       FROM customer_orders co
       JOIN customers c ON co.customer_id = c.customer_id
       WHERE co.order_id = ?`,
      [orderId]
    );

    if (!order) {
      return null;
    }

    // Get all items for this order
    const items: OrderItem[] = [];

    // Get tickets
    const tickets = await query<any[]>(
      `SELECT
        'ticket' as item_type,
        ticket_id as item_id,
        CONCAT(ticket_type, ' Ticket') as name,
        1 as quantity,
        price as unit_price,
        price as line_total,
        JSON_OBJECT('visit_date', visit_date, 'ticket_type', ticket_type) as metadata
       FROM tickets
       WHERE order_id = ?`,
      [orderId]
    );
    items.push(...tickets);

    // Get event registrations
    const events = await query<any[]>(
      `SELECT
        'event' as item_type,
        er.registration_id as item_id,
        e.name as name,
        er.number_of_participants as quantity,
        (er.total_amount / er.number_of_participants) as unit_price,
        er.total_amount as line_total,
        JSON_OBJECT('event_date', e.event_date, 'participants', er.number_of_participants) as metadata
       FROM event_registrations er
       JOIN events e ON er.event_id = e.event_id
       WHERE er.order_id = ?`,
      [orderId]
    );
    items.push(...events);

    // Get cafe items
    const cafeItems = await query<any[]>(
      `SELECT
        'cafe_item' as item_type,
        cs.sale_id as item_id,
        ci.name as name,
        cs.quantity as quantity,
        (cs.line_total / cs.quantity) as unit_price,
        cs.line_total as line_total,
        JSON_OBJECT('cafe_name', c.name) as metadata
       FROM cafe_sales cs
       JOIN cafe_items ci ON cs.item_id = ci.item_id
       JOIN cafes c ON cs.cafe_id = c.cafe_id
       WHERE cs.order_id = ?`,
      [orderId]
    );
    items.push(...cafeItems);

    // Get gift shop items
    const giftShopItems = await query<any[]>(
      `SELECT
        'gift_shop_item' as item_type,
        gsi.sale_item_id as item_id,
        gi.name as name,
        gsi.quantity as quantity,
        gsi.unit_price as unit_price,
        (gsi.quantity * gsi.unit_price) as line_total,
        JSON_OBJECT('gift_shop_name', gs.name) as metadata
       FROM gift_shop_sale_items gsi
       JOIN gift_shop_items gi ON gsi.item_id = gi.item_id
       JOIN gift_shop_sales_transactions gst ON gsi.transaction_id = gst.transaction_id
       JOIN gift_shops gs ON gst.gift_shop_id = gs.gift_shop_id
       WHERE gst.order_id = ?`,
      [orderId]
    );
    items.push(...giftShopItems);

    // Get donations
    const donations = await query<any[]>(
      `SELECT
        'donation' as item_type,
        donation_id as item_id,
        'Conservation Donation' as name,
        1 as quantity,
        amount as unit_price,
        amount as line_total,
        JSON_OBJECT('message', message, 'is_standalone', is_standalone) as metadata
       FROM donations
       WHERE order_id = ?`,
      [orderId]
    );
    items.push(...donations);

    return {
      ...order,
      items,
    };
  }

  /**
   * Get all orders for a customer
   */
  static async findByCustomerId(customerId: number): Promise<CustomerOrder[]> {
    return query<CustomerOrder[]>(
      'SELECT * FROM customer_orders WHERE customer_id = ? ORDER BY order_date DESC',
      [customerId]
    );
  }

  /**
   * Update order status
   */
  static async updateStatus(orderId: number, status: 'pending' | 'completed' | 'cancelled'): Promise<void> {
    await query(
      'UPDATE customer_orders SET status = ? WHERE order_id = ?',
      [status, orderId]
    );
  }
}
