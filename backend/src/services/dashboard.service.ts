import { query } from '../config/database';

export class DashboardService {
  // Public stats for landing page (no authentication required)
  static async getPublicStats() {
    // Get total species count (distinct species)
    const [speciesResult] = await query<any[]>(
      'SELECT COUNT(DISTINCT species) as count FROM animals WHERE active_status = "active" AND deleted_at IS NULL'
    );
    const totalSpecies = speciesResult.count;

    // Get total habitats
    const [habitatsResult] = await query<any[]>(
      'SELECT COUNT(*) as count FROM habitats WHERE status = "active" AND deleted_at IS NULL'
    );
    const totalHabitats = habitatsResult.count;

    // Get annual visitors (sum of all tickets from current year)
    const [visitorsResult] = await query<any[]>(
      'SELECT COUNT(*) as count FROM tickets WHERE YEAR(visit_date) = YEAR(CURDATE())'
    );
    const annualVisitors = visitorsResult.count;

    return {
      totalSpecies,
      totalHabitats,
      annualVisitors,
    };
  }

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

  static async getRecentActivity(userRole?: string) {
    const activities: any[] = [];

    // Managers see all activities
    if (!userRole || userRole === 'manager') {
      // Get recent animals (last 5)
      const recentAnimals = await query<any[]>(
        'SELECT animal_id, name, species, created_date FROM animals WHERE deleted_at IS NULL ORDER BY created_date DESC LIMIT 5'
      );
      recentAnimals.forEach(animal => {
        activities.push({
          type: 'animal',
          title: 'New animal added',
          description: `${animal.name} the ${animal.species} was added to the zoo`,
          timestamp: animal.created_date,
        });
      });

      // Get recent events (last 5) - Fixed column name and sort order
      const recentEvents = await query<any[]>(
        'SELECT event_id, name, event_date FROM events ORDER BY event_date DESC, event_id DESC LIMIT 5'
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
        'SELECT employee_id, first_name, last_name, job_role, hire_date FROM employees WHERE deleted_at IS NULL ORDER BY hire_date DESC LIMIT 5'
      );
      recentEmployees.forEach(employee => {
        activities.push({
          type: 'employee',
          title: 'New employee onboarded',
          description: `${employee.first_name} ${employee.last_name} joined as ${employee.job_role}`,
          timestamp: employee.hire_date,
        });
      });
    }

    // Keepers and Veterinarians see animal-related activities
    if (userRole === 'keeper' || userRole === 'veterinarian') {
      const recentAnimals = await query<any[]>(
        'SELECT animal_id, name, species, created_date FROM animals WHERE deleted_at IS NULL ORDER BY created_date DESC LIMIT 8'
      );
      recentAnimals.forEach(animal => {
        activities.push({
          type: 'animal',
          title: 'New animal added',
          description: `${animal.name} the ${animal.species} was added to the zoo`,
          timestamp: animal.created_date,
        });
      });

      // Get recent feeding logs for context
      const recentFeedings = await query<any[]>(
        `SELECT fl.log_id, fl.feeding_time, a.name, a.species, e.first_name, e.last_name
         FROM feeding_logs fl
         JOIN animals a ON fl.animal_id = a.animal_id
         LEFT JOIN employees e ON fl.keeper_id = e.employee_id
         WHERE a.deleted_at IS NULL
         ORDER BY fl.feeding_time DESC LIMIT 5`
      );
      recentFeedings.forEach(feeding => {
        activities.push({
          type: 'animal',
          title: 'Animal feeding logged',
          description: `${feeding.name} the ${feeding.species} was fed${feeding.first_name ? ` by ${feeding.first_name} ${feeding.last_name}` : ''}`,
          timestamp: feeding.feeding_time,
        });
      });
    }

    // Coordinators, Guides, Security see event activities
    if (userRole === 'coordinator' || userRole === 'guide' || userRole === 'security') {
      const recentEvents = await query<any[]>(
        'SELECT event_id, name, event_date FROM events ORDER BY event_date DESC, event_id DESC LIMIT 8'
      );
      recentEvents.forEach(event => {
        activities.push({
          type: 'event',
          title: 'Event scheduled',
          description: `${event.name} scheduled for ${new Date(event.event_date).toLocaleDateString()}`,
          timestamp: event.event_date,
        });
      });
    }

    // Cashiers see ticket and sales activities
    if (userRole === 'cashier') {
      const recentTickets = await query<any[]>(
        'SELECT ticket_id, ticket_type, price, purchase_date FROM tickets ORDER BY purchase_date DESC LIMIT 8'
      );
      recentTickets.forEach(ticket => {
        activities.push({
          type: 'ticket',
          title: 'Ticket sold',
          description: `${ticket.ticket_type} ticket sold for $${ticket.price}`,
          timestamp: ticket.purchase_date,
        });
      });
    }

    // Maintenance sees habitat activities
    if (userRole === 'maintenance') {
      const recentHabitats = await query<any[]>(
        'SELECT habitat_id, habitat_name, last_maintenance, status FROM habitats WHERE deleted_at IS NULL ORDER BY last_maintenance DESC LIMIT 8'
      );
      recentHabitats.forEach(habitat => {
        activities.push({
          type: 'habitat',
          title: 'Habitat maintenance',
          description: `${habitat.habitat_name} - Status: ${habitat.status}`,
          timestamp: habitat.last_maintenance || new Date().toISOString(),
        });
      });
    }

    // Sort all activities by timestamp (most recent first)
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Return top 10
    return activities.slice(0, 10);
  }

  static async getKeeperAssignments(keeperId: number) {
    const assignments = await query<any[]>(
      `SELECT
        a.animal_id,
        a.name,
        a.species,
        a.health_status,
        h.habitat_name,
        za.shift
       FROM zookeeper_assignments za
       JOIN animals a ON za.animal_id = a.animal_id
       LEFT JOIN habitats h ON a.habitat_id = h.habitat_id
       WHERE za.keeper_id = ? AND a.deleted_at IS NULL AND a.active_status = 'active'
       ORDER BY a.name`,
      [keeperId]
    );
    return assignments;
  }

  static async getVeterinarianAnimals() {
    // Vets can see all animals, but prioritize those with health issues
    const animals = await query<any[]>(
      `SELECT
        a.animal_id,
        a.name,
        a.species,
        a.health_status,
        a.medical_notes,
        h.habitat_name,
        a.updated_date
       FROM animals a
       LEFT JOIN habitats h ON a.habitat_id = h.habitat_id
       WHERE a.deleted_at IS NULL AND a.active_status = 'active'
       ORDER BY
         CASE a.health_status
           WHEN 'critical' THEN 1
           WHEN 'poor' THEN 2
           WHEN 'fair' THEN 3
           WHEN 'good' THEN 4
           WHEN 'excellent' THEN 5
         END,
         a.name
       LIMIT 20`
    );
    return animals;
  }
}
