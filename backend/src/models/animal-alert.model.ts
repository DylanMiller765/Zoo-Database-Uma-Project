import { query } from "../config/database";
import { AnimalAlert } from "../types/animal-alert.types";

export class AnimalAlertModel {
  static async getUnprocessedAlerts(count: number): Promise<AnimalAlert[] | null> {
    const sql = `
      SELECT * FROM animals_alert_queue
      WHERE processed_at IS NULL
      ORDER BY created_at ASC
      LIMIT ${count}
    `;

    const vetsSql = `
      SELECT email FROM employees
      WHERE job_role = 'veterinarian' AND deleted_at IS NULL
    `;
    const vets = await query<{ email: string }[]>(vetsSql);
    const veterinarianEmails = vets.map((vet) => vet.email);
    const results = await query<AnimalAlert[]>(sql);
    results.forEach((alert) => {
      alert.veterinarian_emails = veterinarianEmails;
    });
    return results.length > 0 ? results : null;
    console.log(results);   
  }

  static async markAlertAsProcessed(animalAlertId: number): Promise<void> {
    const sql = `
      UPDATE animals_alert_queue
      SET processed_at = NOW()
      WHERE animal_alert_id = ?
    `;
    await query(sql, [animalAlertId]);
  }

  static async getUnprocessedAlertsCount(): Promise<number> {
    const sql = `
      SELECT COUNT(*) as count FROM animals_alert_queue
      WHERE processed_at IS NULL
    `;
    const [result] = await query<any[]>(sql);
    return result?.count || 0;
  }

}
