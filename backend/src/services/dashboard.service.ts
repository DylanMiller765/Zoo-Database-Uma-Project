import { query } from '../config/database';

export class DashboardService {
  static async getStats() {
    // Get total animals
    const [animalsResult] = await query<any[]>(
      'SELECT COUNT(*) as count FROM animals WHERE active_status = "active"'
    );
    const totalAnimals = animalsResult.count;

    // Get total employees
    const [employeesResult] = await query<any[]>(
      'SELECT COUNT(*) as count FROM employees WHERE status = "active"'
    );
    const totalEmployees = employeesResult.count;

    // Get upcoming events
    const [eventsResult] = await query<any[]>(
      'SELECT COUNT(*) as count FROM events WHERE event_date >= CURDATE()'
    );
    const upcomingEvents = eventsResult.count;

    // Get active habitats
    const [habitatsResult] = await query<any[]>(
      'SELECT COUNT(*) as count FROM habitats WHERE status = "active"'
    );
    const activeHabitats = habitatsResult.count;

    // Get today's visitors (tickets with visit_date = today)
    const [visitorsResult] = await query<any[]>(
      'SELECT COUNT(*) as count FROM tickets WHERE visit_date = CURDATE()'
    );
    const todaysVisitors = visitorsResult.count;

    // Get monthly revenue (tickets from current month)
    const [revenueResult] = await query<any[]>(
      'SELECT COALESCE(SUM(price), 0) as total FROM tickets WHERE MONTH(purchase_date) = MONTH(CURDATE()) AND YEAR(purchase_date) = YEAR(CURDATE())'
    );
    const monthlyRevenue = parseFloat(revenueResult.total) || 0;

    return {
      totalAnimals,
      totalEmployees,
      upcomingEvents,
      activeHabitats,
      todaysVisitors,
      monthlyRevenue,
    };
  }
}
