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

  static async getRecentActivity() {
    const activities: any[] = [];

    // Get recent animals (last 5)
    const recentAnimals = await query<any[]>(
      'SELECT animal_id, name, species, created_date FROM animals ORDER BY created_date DESC LIMIT 5'
    );
    recentAnimals.forEach(animal => {
      activities.push({
        type: 'animal',
        title: 'New animal added',
        description: `${animal.name} the ${animal.species} was added to the zoo`,
        timestamp: animal.created_date,
      });
    });

    // Get recent events (last 5)
    const recentEvents = await query<any[]>(
      'SELECT event_id, name, event_date FROM events ORDER BY event_id DESC LIMIT 5'
    );
    recentEvents.forEach(event => {
      activities.push({
        type: 'event',
        title: 'Event scheduled',
        description: `${event.name} scheduled for ${new Date(event.event_date).toLocaleDateString()}`,
        timestamp: event.event_date,
      });
    });

    // Get recent employees (last 5)
    const recentEmployees = await query<any[]>(
      'SELECT employee_id, first_name, last_name, job_role, hire_date FROM employees ORDER BY hire_date DESC LIMIT 5'
    );
    recentEmployees.forEach(employee => {
      activities.push({
        type: 'employee',
        title: 'New employee onboarded',
        description: `${employee.first_name} ${employee.last_name} joined as ${employee.job_role}`,
        timestamp: employee.hire_date,
      });
    });

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Return top 3
    return activities.slice(0, 3);
  }
}
