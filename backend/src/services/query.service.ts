import { query } from '../config/database';

export class QueryService {
  // Query 1: Animals by Habitat
  static async getAnimalsByHabitat() {
    const sql = `
      SELECT
        h.habitat_id,
        h.habitat_name,
        h.environment_type,
        h.animal_capacity,
        h.status as habitat_status,
        a.animal_id,
        a.name as animal_name,
        a.species,
        a.health_status,
        a.active_status,
        a.endangerment_status
      FROM habitats h
      LEFT JOIN animals a ON h.habitat_id = a.habitat_id
      WHERE h.status = 'active'
      ORDER BY h.habitat_name, a.name
    `;
    return await query<any[]>(sql);
  }

  // Query 2: Employee Assignments (Keepers to Animals)
  static async getEmployeeAssignments() {
    const sql = `
      SELECT
        e.employee_id,
        e.first_name,
        e.last_name,
        e.job_role,
        e.email,
        a.animal_id,
        a.name as animal_name,
        a.species,
        za.shift
      FROM employees e
      INNER JOIN zookeeper_assignments za ON e.employee_id = za.keeper_id
      INNER JOIN animals a ON za.animal_id = a.animal_id
      WHERE e.status = 'active' AND a.active_status = 'active'
      ORDER BY e.last_name, e.first_name, a.name
    `;
    return await query<any[]>(sql);
  }

  // Query 3: Revenue Analysis
  static async getRevenueAnalysis() {
    const sql = `
      SELECT
        'Tickets' as revenue_source,
        COUNT(*) as transaction_count,
        SUM(price) as total_revenue,
        AVG(price) as avg_transaction,
        MONTH(purchase_date) as month,
        YEAR(purchase_date) as year
      FROM tickets
      GROUP BY YEAR(purchase_date), MONTH(purchase_date)

      UNION ALL

      SELECT
        'Event Registrations' as revenue_source,
        COUNT(*) as transaction_count,
        SUM(total_amount) as total_revenue,
        AVG(total_amount) as avg_transaction,
        MONTH(registration_date) as month,
        YEAR(registration_date) as year
      FROM event_registrations
      WHERE payment_status = 'paid'
      GROUP BY YEAR(registration_date), MONTH(registration_date)

      ORDER BY year DESC, month DESC, revenue_source
    `;
    return await query<any[]>(sql);
  }

  // Query 4: Event Attendance
  static async getEventAttendance() {
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
        COALESCE(SUM(er.number_of_participants), 0) as total_registered,
        COALESCE(SUM(er.total_amount), 0) as total_revenue,
        COUNT(er.registration_id) as registration_count,
        CASE
          WHEN e.max_participants IS NULL THEN NULL
          ELSE ROUND((COALESCE(SUM(er.number_of_participants), 0) / e.max_participants) * 100, 2)
        END as capacity_percentage
      FROM events e
      LEFT JOIN event_registrations er ON e.event_id = er.event_id
      WHERE e.event_date >= CURDATE()
      GROUP BY e.event_id, e.name, e.event_date, e.start_time, e.end_time, e.location, e.max_participants, e.ticket_price
      ORDER BY e.event_date, e.start_time
    `;
    return await query<any[]>(sql);
  }

  // Query 5: Visitor Statistics
  static async getVisitorStatistics(startDate?: string, endDate?: string) {
    let sql = `
      SELECT
        ticket_type,
        payment_method,
        DATE(visit_date) as visit_date,
        COUNT(*) as ticket_count,
        SUM(price) as total_revenue,
        AVG(price) as avg_price
      FROM tickets
    `;

    const params: any[] = [];

    if (startDate && endDate) {
      sql += ` WHERE visit_date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    } else if (startDate) {
      sql += ` WHERE visit_date >= ?`;
      params.push(startDate);
    } else if (endDate) {
      sql += ` WHERE visit_date <= ?`;
      params.push(endDate);
    }

    sql += `
      GROUP BY ticket_type, payment_method, DATE(visit_date)
      ORDER BY visit_date DESC, ticket_type, payment_method
    `;

    return await query<any[]>(sql, params);
  }

  // Summary for Visitor Statistics
  static async getVisitorStatisticsSummary(startDate?: string, endDate?: string) {
    let sql = `
      SELECT
        COUNT(*) as total_tickets,
        SUM(price) as total_revenue,
        AVG(price) as avg_ticket_price,
        COUNT(DISTINCT DATE(visit_date)) as unique_days,
        COUNT(DISTINCT customer_id) as unique_customers
      FROM tickets
    `;

    const params: any[] = [];

    if (startDate && endDate) {
      sql += ` WHERE visit_date BETWEEN ? AND ?`;
      params.push(startDate, endDate);
    } else if (startDate) {
      sql += ` WHERE visit_date >= ?`;
      params.push(startDate);
    } else if (endDate) {
      sql += ` WHERE visit_date <= ?`;
      params.push(endDate);
    }

    const results = await query<any[]>(sql, params);
    return results[0] || {};
  }
}
