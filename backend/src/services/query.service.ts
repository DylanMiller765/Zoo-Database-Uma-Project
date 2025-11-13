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
  startDate: string;
  endDate: string;
  eventStatus?: string;
  minCapacity?: number;
  includeCanceled?: boolean;
  includeDeleted?: boolean;
}

interface FinancialReportParams {
  startDate: string;
  endDate: string;
  sources?: string[];
  grouping?: string;
  includeReturns?: boolean;
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
      minCapacity = 0,
      includeCanceled = false,
      includeDeleted = false
    } = params;

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
        e.event_date BETWEEN ? AND ?
        AND (? = 'all'
             OR (? = 'upcoming' AND e.event_date >= CURDATE())
             OR (? = 'past' AND e.event_date < CURDATE()))
        AND (e.deleted_at IS NULL ${includeDeleted ? 'OR 1=1' : ''})

      GROUP BY e.event_id, e.name, e.event_date, e.start_time, e.end_time,
               e.location, e.max_participants, e.ticket_price, coordinator_name, e.description

      HAVING (? = 0 OR capacity_percentage IS NULL OR capacity_percentage >= ?)

      ORDER BY e.event_date, e.start_time
    `;

    const queryParams = [
      startDate,
      endDate,
      eventStatus, eventStatus, eventStatus,
      minCapacity, minCapacity
    ];

    return await query<any[]>(sql, queryParams);
  }

  /**
   * Report 3: Financial Report
   * Comprehensive revenue analysis across all sources
   */
  static async getFinancialReport(params: FinancialReportParams) {
    const {
      startDate,
      endDate,
      sources = ['tickets', 'events', 'gift_shops', 'cafes'],
      grouping = 'monthly',
      includeReturns = false
    } = params;

    // Build UNION query based on selected sources
    const queries: string[] = [];
    const queryParams: any[] = [];

    // Ticket Sales
    if (sources.includes('tickets')) {
      queries.push(`
        SELECT
          'Ticket Sales' as revenue_source,
          DATE(purchase_date) as transaction_date,
          ticket_type as category,
          payment_method,
          COUNT(*) as transaction_count,
          SUM(price) as total_revenue,
          AVG(price) as avg_transaction_value
        FROM tickets
        WHERE purchase_date BETWEEN ? AND ?
          AND deleted_at IS NULL
        GROUP BY DATE(purchase_date), ticket_type, payment_method
      `);
      queryParams.push(startDate, endDate);
    }

    // Event Registrations
    if (sources.includes('events')) {
      queries.push(`
        SELECT
          'Event Registrations' as revenue_source,
          DATE(er.registration_date) as transaction_date,
          e.name as category,
          'online' as payment_method,
          COUNT(*) as transaction_count,
          SUM(er.total_amount) as total_revenue,
          AVG(er.total_amount) as avg_transaction_value
        FROM event_registrations er
        JOIN events e ON er.event_id = e.event_id
        WHERE er.registration_date BETWEEN ? AND ?
          AND er.payment_status = 'paid'
          AND er.deleted_at IS NULL
        GROUP BY DATE(er.registration_date), e.name
      `);
      queryParams.push(startDate, endDate);
    }

    // Gift Shop Sales
    if (sources.includes('gift_shops')) {
      queries.push(`
        SELECT
          'Gift Shop Sales' as revenue_source,
          DATE(gst.sale_date) as transaction_date,
          gs.name as category,
          gst.payment_method,
          COUNT(*) as transaction_count,
          SUM(gst.total_amount) as total_revenue,
          AVG(gst.total_amount) as avg_transaction_value
        FROM gift_shop_sales_transactions gst
        JOIN gift_shops gs ON gst.gift_shop_id = gs.gift_shop_id
        WHERE gst.sale_date BETWEEN ? AND ?
          ${includeReturns ? '' : "AND gst.status = 'completed'"}
        GROUP BY DATE(gst.sale_date), gs.name, gst.payment_method
      `);
      queryParams.push(startDate, endDate);
    }

    // Cafe Sales
    if (sources.includes('cafes')) {
      queries.push(`
        SELECT
          'Cafe Sales' as revenue_source,
          DATE(cs.sale_timestamp) as transaction_date,
          c.name as category,
          'pos' as payment_method,
          COUNT(DISTINCT cs.transaction_id) as transaction_count,
          SUM(cs.line_total) as total_revenue,
          AVG(cs.line_total) as avg_transaction_value
        FROM cafe_sales cs
        JOIN cafes c ON cs.cafe_id = c.cafe_id
        WHERE cs.sale_timestamp BETWEEN ? AND ?
          ${includeReturns ? '' : "AND cs.status = 'completed'"}
        GROUP BY DATE(cs.sale_timestamp), c.name
      `);
      queryParams.push(startDate, endDate);
    }

    if (queries.length === 0) {
      return [];
    }

    const sql = queries.join('\n      UNION ALL\n      ') + `
      ORDER BY transaction_date DESC, revenue_source
    `;

    return await query<any[]>(sql, queryParams);
  }

  /**
   * Financial Report Summary
   * Aggregated totals across all revenue sources
   */
  static async getFinancialReportSummary(params: FinancialReportParams) {
    const data = await this.getFinancialReport(params);

    const summary = {
      total_revenue: 0,
      total_transactions: 0,
      avg_transaction: 0,
      by_source: {} as Record<string, any>
    };

    data.forEach((row: any) => {
      summary.total_revenue += parseFloat(row.total_revenue || 0);
      summary.total_transactions += parseInt(row.transaction_count || 0);

      if (!summary.by_source[row.revenue_source]) {
        summary.by_source[row.revenue_source] = {
          revenue: 0,
          transactions: 0
        };
      }

      summary.by_source[row.revenue_source].revenue += parseFloat(row.total_revenue || 0);
      summary.by_source[row.revenue_source].transactions += parseInt(row.transaction_count || 0);
    });

    summary.avg_transaction = summary.total_transactions > 0
      ? summary.total_revenue / summary.total_transactions
      : 0;

    return summary;
  }
}
