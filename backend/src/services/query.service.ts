import { query } from '../config/database';

interface AnimalHealthCareParams {
  startDate?: string;
  endDate?: string;
  habitatStatus?: string | string[];
  healthStatus?: string | string[];
  endangerment?: string | string[];
  feedingCompliance?: string;
  includeDeleted?: boolean;
}

interface EventPerformanceParams {
  startDate?: string;
  endDate?: string;
  eventStatus?: string;
  includeCanceled?: boolean;
  includeDeleted?: boolean;
}

interface FinancialReportParams {
  startDate?: string;
  endDate?: string;
  sources?: string[];
  grouping?: string;
  includeReturns?: boolean;
  includeCanceled?: boolean;
}

export class QueryService {
  /**
   * Report 1: Animal Health & Care Report
   * Comprehensive animal welfare data including health, feeding, and habitat info
   */
  static async getAnimalHealthAndCare(params: AnimalHealthCareParams = {}) {
    const {
      startDate,
      endDate,
      habitatStatus,
      healthStatus,
      endangerment,
      includeDeleted = false
    } = params;

    // Helper to convert params to arrays
    const habitatStatuses = Array.isArray(habitatStatus) ? habitatStatus : (habitatStatus ? [habitatStatus] : []);
    const healthStatuses = Array.isArray(healthStatus) ? healthStatus : (healthStatus ? [healthStatus] : []);
    const endangermentStatuses = Array.isArray(endangerment) ? endangerment : (endangerment ? [endangerment] : []);

    // Build WHERE clauses
    const habitatWhere = habitatStatuses.length > 0
      ? `h.status IN (${habitatStatuses.map(() => '?').join(',')})`
      : '1=1';

    const healthWhere = healthStatuses.length > 0
      ? `a.health_status IN (${healthStatuses.map(() => '?').join(',')})`
      : '1=1';

    const endangermentWhere = endangermentStatuses.length > 0
      ? `a.endangerment_status IN (${endangermentStatuses.map(() => '?').join(',')})`
      : '1=1';

    const sql = `
      SELECT
        -- Habitat data
        h.habitat_id,
        h.habitat_name,
        h.environment_type,
        h.animal_capacity,
        h.status as habitat_status,
        h.size,
        h.last_maintenance,

        -- Animal data
        a.animal_id,
        a.name as animal_name,
        a.species,
        a.date_of_birth,
        a.arrival_date,
        a.health_status,
        a.active_status,
        a.endangerment_status,
        a.weight,
        a.medical_notes,

        -- Keeper assignment
        e.employee_id as keeper_id,
        CONCAT(e.first_name, ' ', e.last_name) as keeper_name,
        za.shift as keeper_shift,

        -- Feeding schedule
        fs.schedule_id,
        fs.food_description as scheduled_food,
        fs.frequency as feeding_frequency,
        fs.scheduled_time,

        -- Recent feeding activity (last 30 days)
        (SELECT COUNT(*)
         FROM feeding_logs fl
         WHERE fl.animal_id = a.animal_id
         AND fl.feeding_time >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        ) as feeding_logs_count,

        (SELECT MAX(fl.feeding_time)
         FROM feeding_logs fl
         WHERE fl.animal_id = a.animal_id
        ) as last_fed_time,

        (SELECT fl.food_given
         FROM feeding_logs fl
         WHERE fl.animal_id = a.animal_id
         ORDER BY fl.feeding_time DESC
         LIMIT 1
        ) as last_food_given

      FROM habitats h
      LEFT JOIN animals a ON h.habitat_id = a.habitat_id
        AND (a.deleted_at IS NULL ${includeDeleted ? 'OR 1=1' : ''})
      LEFT JOIN zookeeper_assignments za ON a.animal_id = za.animal_id
      LEFT JOIN employees e ON za.keeper_id = e.employee_id AND e.deleted_at IS NULL
      LEFT JOIN feeding_schedules fs ON a.animal_id = fs.animal_id

      WHERE
        (${habitatWhere})
        AND (a.animal_id IS NULL OR ${healthWhere})
        AND (a.animal_id IS NULL OR ${endangermentWhere})
        ${startDate ? 'AND (a.animal_id IS NULL OR a.arrival_date >= ?)' : ''}
        ${endDate ? 'AND (a.animal_id IS NULL OR a.arrival_date <= ?)' : ''}
        AND (h.deleted_at IS NULL ${includeDeleted ? 'OR 1=1' : ''})

      ORDER BY h.habitat_name, a.name
    `;

    const queryParams: any[] = [];

    // Add filter array values
    queryParams.push(...habitatStatuses);
    queryParams.push(...healthStatuses);
    queryParams.push(...endangermentStatuses);

    // Add arrival date filters if provided
    if (startDate) queryParams.push(startDate);
    if (endDate) queryParams.push(endDate);

    return await query<any[]>(sql, queryParams);
  }

  /**
   * Report 2: Event Performance Report
   * Event attendance, capacity utilization, and revenue analysis
   */
  static async getEventPerformance(params: EventPerformanceParams) {
    const {
      startDate,
      endDate,
      eventStatus = 'all',
      includeCanceled = false,
      includeDeleted = false
    } = params;

    const dateFilter = startDate && endDate ? 'e.event_date BETWEEN ? AND ?' : '1=1';
    const cancelledFilter = includeCanceled ? '' : 'AND e.deleted_at IS NULL';

    const sql = `
      SELECT
        e.event_id,
        e.name as event_name,
        e.event_date,
        e.start_time,
        e.end_time,
        e.location,
        e.max_participants,
        e.ticket_price,

        -- Registration metrics
        COALESCE(SUM(er.number_of_participants), 0) as total_registered,
        COALESCE(SUM(er.total_amount), 0) as total_revenue,
        COUNT(er.registration_id) as registration_count,

        -- Capacity analysis
        CASE
          WHEN e.max_participants IS NULL THEN NULL
          ELSE ROUND((COALESCE(SUM(er.number_of_participants), 0) / e.max_participants) * 100, 2)
        END as capacity_percentage,

        -- Coordinator info
        CONCAT(emp.first_name, ' ', emp.last_name) as coordinator_name,
        e.description

      FROM events e
      LEFT JOIN event_registrations er ON e.event_id = er.event_id
        AND er.payment_status = 'paid'
        AND (er.deleted_at IS NULL ${includeDeleted ? 'OR 1=1' : ''})
      LEFT JOIN employees emp ON e.coordinator_id = emp.employee_id

      WHERE
        ${dateFilter}
        AND (? = 'all'
             OR (? = 'upcoming' AND e.event_date >= CURDATE())
             OR (? = 'past' AND e.event_date < CURDATE()))
        ${cancelledFilter}

      GROUP BY e.event_id, e.name, e.event_date, e.start_time, e.end_time,
               e.location, e.max_participants, e.ticket_price, coordinator_name, e.description

      ORDER BY e.event_date, e.start_time
    `;

    const queryParams = [];
    if (startDate && endDate) {
        queryParams.push(startDate, endDate);
    }
    queryParams.push(eventStatus, eventStatus, eventStatus);

    return await query<any[]>(sql, queryParams);
  }

  /**
   * Report 3: Financial Report - Ticket Revenue
   * Detailed breakdown of ticket sales by type
   */
  static async getTicketRevenue(startDate?: string, endDate?: string, includeReturns: boolean = false) {
    const dateFilter = startDate && endDate ? 'WHERE DATE(purchase_date) BETWEEN ? AND ?' : 'WHERE 1=1';
    const params = startDate && endDate ? [startDate, endDate] : [];

    // Query 1: Revenue by ticket type
    const byType = await query<any[]>(`
      SELECT
        ticket_type,
        COUNT(*) as count,
        SUM(price) as revenue,
        price as unit_price
      FROM tickets
      ${dateFilter}
        AND deleted_at IS NULL
      GROUP BY ticket_type, price
      ORDER BY revenue DESC
    `, params);

    const total = byType.reduce((sum, row) => sum + parseFloat(row.revenue || 0), 0);
    const transactions = byType.reduce((sum, row) => sum + parseInt(row.count || 0), 0);

    return {
      total,
      transactions,
      byType
    };
  }

  /**
   * Report 3: Financial Report - Event Revenue
   * Detailed breakdown of event registrations by event
   */
  static async getEventRevenue(startDate?: string, endDate?: string, includeCanceled: boolean = false) {
    const dateFilter = startDate && endDate ? 'e.event_date BETWEEN ? AND ?' : '1=1';
    const params = startDate && endDate ? [startDate, endDate] : [];
    const cancelledFilter = includeCanceled ? '' : 'AND e.deleted_at IS NULL';

    const byEvent = await query<any[]>(`
      SELECT
        e.event_id,
        e.name as event_name,
        e.event_date,
        e.location,
        e.ticket_price,
        CASE WHEN e.deleted_at IS NOT NULL THEN 'cancelled' ELSE 'active' END as event_status,
        e.deleted_at,
        COUNT(er.registration_id) as registrations,
        SUM(er.number_of_participants) as participants,
        SUM(CASE WHEN er.refunded_at IS NULL THEN er.total_amount ELSE 0 END) as revenue,
        SUM(CASE WHEN er.refunded_at IS NOT NULL THEN er.total_amount ELSE 0 END) as refunded_amount,
        er.payment_status
      FROM events e
      LEFT JOIN event_registrations er ON e.event_id = er.event_id
        AND (er.deleted_at IS NULL)
        AND er.payment_status = 'paid'
      WHERE ${dateFilter}
        ${cancelledFilter}
        AND er.registration_id IS NOT NULL
      GROUP BY e.event_id, e.name, e.event_date, e.location, e.ticket_price, e.deleted_at, er.payment_status
      ORDER BY revenue DESC
    `, params);

    // Process the data to properly handle cancelled events
    // For cancelled events: treat the entire revenue amount as refunded (money that was returned)
    const processedEvents = byEvent.map(event => {
      if (event.deleted_at !== null) {
        // Cancelled event: the revenue becomes a refund, actual revenue is 0
        const totalAmount = parseFloat(event.revenue || 0) + parseFloat(event.refunded_amount || 0);
        return {
          ...event,
          revenue: totalAmount, // Show original revenue
          refunded_amount: totalAmount // Entire amount is refunded (cancelled)
        };
      }
      return event;
    });

    // Separate active and cancelled events
    const activeEvents = processedEvents.filter(event => event.deleted_at === null);
    const cancelledEvents = processedEvents.filter(event => event.deleted_at !== null);

    let totalRefunds = 0;
    let refundCount = 0;

    try {
      // Refunds from active events
      const activeRefunds = activeEvents.reduce((sum, row) => sum + parseFloat(row.refunded_amount || 0), 0);

      // Refunds from cancelled events (entire revenue amount is refunded)
      const cancelledRefunds = cancelledEvents.reduce((sum, row) => sum + parseFloat(row.refunded_amount || 0), 0);

      totalRefunds = activeRefunds + cancelledRefunds;

      // Count refunded registrations
      refundCount = processedEvents.reduce((sum, row) => {
        if (parseFloat(row.refunded_amount || 0) > 0) {
          return sum + parseInt(row.registrations || 0);
        }
        return sum;
      }, 0);
    } catch (error) {
      // If there's any issue calculating refunds, just set to 0
      totalRefunds = 0;
      refundCount = 0;
    }

    // Gross revenue = all event revenue (active + cancelled)
    const grossRevenue = processedEvents.reduce((sum, row) => sum + parseFloat(row.revenue || 0), 0);

    // Net revenue = gross revenue - refunds
    const netRevenue = grossRevenue - totalRefunds;

    // Count registrations and participants from all events
    const registrations = processedEvents.reduce((sum, row) => sum + parseInt(row.registrations || 0), 0);
    const participants = processedEvents.reduce((sum, row) => sum + parseInt(row.participants || 0), 0);

    return {
      gross_revenue: grossRevenue,
      total_refunds: totalRefunds,
      net_revenue: netRevenue, // Actual money retained after refunds
      total: netRevenue, // For backwards compatibility - return net revenue
      registrations,
      participants,
      refund_count: refundCount,
      byEvent: processedEvents
    };
  }

  /**
   * Report 3: Financial Report - Gift Shop Revenue
   * Detailed breakdown of gift shop sales by shop
   */
  static async getGiftShopRevenue(startDate?: string, endDate?: string, includeReturns: boolean = false) {
    const dateFilter = startDate && endDate ? 'WHERE DATE(gst.sale_date) BETWEEN ? AND ?' : 'WHERE 1=1';
    const params = startDate && endDate ? [startDate, endDate] : [];

    // Query 1: Revenue by gift shop
    const byShop = await query<any[]>(`
      SELECT
        gs.gift_shop_id,
        gs.name as shop_name,
        gs.location,
        COUNT(*) as transactions,
        SUM(gst.total_amount) as revenue,
        SUM(CASE WHEN gst.status = 'returned' THEN 1 ELSE 0 END) as returns
      FROM gift_shop_sales_transactions gst
      JOIN gift_shops gs ON gst.gift_shop_id = gs.gift_shop_id
      ${dateFilter}
        ${includeReturns ? '' : "AND gst.status = 'completed'"}
      GROUP BY gs.gift_shop_id, gs.name, gs.location
      ORDER BY revenue DESC
    `, params);

    // Query 2: Items sold breakdown
    const byItemDateFilter = startDate && endDate ? 'WHERE DATE(gst.sale_date) BETWEEN ? AND ?' : 'WHERE 1=1';
    const byItem = await query<any[]>(`
      SELECT
        gsi.item_id,
        gi.name as item_name,
        gi.category,
        SUM(gsi.quantity) as total_quantity,
        gsi.unit_price,
        SUM(gsi.quantity * gsi.unit_price) as total_revenue
      FROM gift_shop_sales_transactions gst
      JOIN gift_shop_sale_items gsi ON gst.transaction_id = gsi.transaction_id
      JOIN gift_shop_items gi ON gsi.item_id = gi.item_id
      ${byItemDateFilter}
        ${includeReturns ? '' : "AND gst.status = 'completed'"}
      GROUP BY gsi.item_id, gi.name, gi.category, gsi.unit_price
      ORDER BY total_revenue DESC
    `, params);

    const total = byShop.reduce((sum, row) => sum + parseFloat(row.revenue || 0), 0);
    const transactions = byShop.reduce((sum, row) => sum + parseInt(row.transactions || 0), 0);
    const returns = byShop.reduce((sum, row) => sum + parseInt(row.returns || 0), 0);

    return {
      total,
      transactions,
      returns,
      byShop,
      byItem
    };
  }

  /**
   * Report 3: Financial Report - Cafe Revenue
   * Detailed breakdown of cafe sales by cafe
   */
  static async getCafeRevenue(startDate?: string, endDate?: string, includeReturns: boolean = false) {
    const dateFilter = startDate && endDate ? 'WHERE DATE(cs.sale_timestamp) BETWEEN ? AND ?' : 'WHERE 1=1';
    const params = startDate && endDate ? [startDate, endDate] : [];

    const byCafe = await query<any[]>(`
      SELECT
        c.cafe_id,
        c.name as cafe_name,
        c.location,
        COUNT(DISTINCT cs.transaction_id) as transactions,
        COUNT(*) as line_items,
        SUM(cs.line_total) as revenue,
        SUM(CASE WHEN cs.status = 'returned' THEN 1 ELSE 0 END) as returns
      FROM cafe_sales cs
      JOIN cafes c ON cs.cafe_id = c.cafe_id
      ${dateFilter}
        ${includeReturns ? '' : "AND cs.status = 'completed'"}
      GROUP BY c.cafe_id, c.name, c.location
      ORDER BY revenue DESC
    `, params);

    // Query 2: Items sold breakdown
    const byItemDateFilter = startDate && endDate ? 'WHERE DATE(cs.sale_timestamp) BETWEEN ? AND ?' : 'WHERE 1=1';
    const byItem = await query<any[]>(`
      SELECT
        cs.item_id,
        ci.name as item_name,
        ci.category,
        ci.price as unit_price,
        SUM(cs.quantity) as total_quantity,
        SUM(cs.line_total) as total_revenue
      FROM cafe_sales cs
      JOIN cafe_items ci ON cs.item_id = ci.item_id
      ${byItemDateFilter}
        ${includeReturns ? '' : "AND cs.status = 'completed'"}
      GROUP BY cs.item_id, ci.name, ci.category, ci.price
      ORDER BY total_revenue DESC
    `, params);

    const total = byCafe.reduce((sum, row) => sum + parseFloat(row.revenue || 0), 0);
    const transactions = byCafe.reduce((sum, row) => sum + parseInt(row.transactions || 0), 0);
    const lineItems = byCafe.reduce((sum, row) => sum + parseInt(row.line_items || 0), 0);
    const returns = byCafe.reduce((sum, row) => sum + parseInt(row.returns || 0), 0);

    return {
      total,
      transactions,
      lineItems,
      returns,
      byCafe,
      byItem
    };
  }

  /**
   * Report 3: Financial Report - Membership Revenue
   * Detailed breakdown of membership purchases
   */
  static async getMembershipRevenue(startDate?: string, endDate?: string) {
    const dateFilter = startDate && endDate ? 'WHERE DATE(purchase_date) BETWEEN ? AND ?' : 'WHERE 1=1';
    const params = startDate && endDate ? [startDate, endDate] : [];

    // Query 1: Revenue by purchase type (manual vs auto-renewal)
    const byType = await query<any[]>(`
      SELECT
        CASE WHEN auto_renewed = TRUE THEN 'Auto-Renewal' ELSE 'Manual Purchase' END as purchase_type,
        COUNT(*) as count,
        SUM(price) as revenue
      FROM membership_purchases
      ${dateFilter}
      GROUP BY auto_renewed
      ORDER BY revenue DESC
    `, params);

    const total = byType.reduce((sum, row) => sum + parseFloat(row.revenue || 0), 0);
    const memberships = byType.reduce((sum, row) => sum + parseInt(row.count || 0), 0);
    const manualPurchases = byType.find(r => r.purchase_type === 'Manual Purchase')?.count || 0;
    const autoRenewals = byType.find(r => r.purchase_type === 'Auto-Renewal')?.count || 0;

    return {
      total,
      memberships,
      manualPurchases,
      autoRenewals,
      byType
    };
  }

  /**
   * Report 3: Financial Report - Donation Revenue
   * Detailed breakdown of donations
   */
  static async getDonationRevenue(startDate?: string, endDate?: string) {
    const dateFilter = startDate && endDate ? 'WHERE DATE(donation_date) BETWEEN ? AND ?' : 'WHERE 1=1';
    const params = startDate && endDate ? [startDate, endDate] : [];

    // Query 1: Total donations
    const donationStats = await query<any[]>(`
      SELECT
        COUNT(*) as count,
        SUM(amount) as revenue
      FROM donations
      ${dateFilter}
    `, params);

    const total = parseFloat(donationStats[0]?.revenue || 0);
    const transactions = parseInt(donationStats[0]?.count || 0);

    return {
      total,
      transactions
    };
  }

  /**
   * Report 3: Financial Report (Comprehensive)
   * Aggregates all revenue sources into a single comprehensive report
   */
  static async getFinancialReport(params: FinancialReportParams) {
    const {
      startDate,
      endDate,
      sources = ['ticket', 'event', 'gift_shop', 'cafe', 'membership', 'donation'],
      includeReturns = false,
      includeCanceled = true
    } = params;

    const result: any = {
      summary: {
        totalRevenue: 0,
        totalTransactions: 0,
        dateRange: {
          start: startDate || null,
          end: endDate || null,
          isAllTime: !startDate && !endDate
        },
        sources: []
      }
    };

    // Fetch each revenue source if selected
    if (sources.includes('ticket')) {
      result.ticketRevenue = await this.getTicketRevenue(startDate, endDate, includeReturns);
      result.summary.totalRevenue += result.ticketRevenue.total;
      result.summary.totalTransactions += result.ticketRevenue.transactions;
      result.summary.sources.push({ name: 'ticket', revenue: result.ticketRevenue.total });
    }

    if (sources.includes('event')) {
      result.eventRevenue = await this.getEventRevenue(startDate, endDate, includeCanceled);
      result.summary.totalRevenue += result.eventRevenue.total;
      result.summary.totalTransactions += result.eventRevenue.registrations;
      result.summary.sources.push({ name: 'event', revenue: result.eventRevenue.total });
    }

    if (sources.includes('gift_shop')) {
      result.giftShopRevenue = await this.getGiftShopRevenue(startDate, endDate, includeReturns);
      result.summary.totalRevenue += result.giftShopRevenue.total;
      result.summary.totalTransactions += result.giftShopRevenue.transactions;
      result.summary.sources.push({ name: 'gift_shop', revenue: result.giftShopRevenue.total });
    }

    if (sources.includes('cafe')) {
      result.cafeRevenue = await this.getCafeRevenue(startDate, endDate, includeReturns);
      result.summary.totalRevenue += result.cafeRevenue.total;
      result.summary.totalTransactions += result.cafeRevenue.transactions;
      result.summary.sources.push({ name: 'cafe', revenue: result.cafeRevenue.total });
    }

    if (sources.includes('membership')) {
      result.membershipRevenue = await this.getMembershipRevenue(startDate, endDate);
      result.summary.totalRevenue += result.membershipRevenue.total;
      result.summary.totalTransactions += result.membershipRevenue.memberships;
      result.summary.sources.push({ name: 'membership', revenue: result.membershipRevenue.total });
    }

    if (sources.includes('donation')) {
      result.donationRevenue = await this.getDonationRevenue(startDate, endDate);
      result.summary.totalRevenue += result.donationRevenue.total;
      result.summary.totalTransactions += result.donationRevenue.transactions;
      result.summary.sources.push({ name: 'donation', revenue: result.donationRevenue.total });
    }

    // Calculate insights
    if (result.summary.sources.length > 0) {
      const largestSource = result.summary.sources.reduce((max: any, src: any) =>
        src.revenue > max.revenue ? src : max
      );
      result.summary.largestRevenueSource = largestSource.name;
      result.summary.largestRevenueAmount = largestSource.revenue;
    }

    return result;
  }

  /**
   * Financial Report Summary (Legacy - kept for backwards compatibility)
   * Aggregated totals across all revenue sources
   */
  static async getFinancialReportSummary(params: FinancialReportParams) {
    const fullReport = await this.getFinancialReport(params);
    return fullReport.summary;
  }
}
