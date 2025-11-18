import { query } from "../config/database";
import { AnimalAlert } from "../types/animal-alert.types";
import { Animal, AnimalModel } from "../models/animal.model";
import { HabitatModel } from "../models/habitat.model";
import { Habitat } from "../types/habitat.types";

export class AnimalAlertModel {
  static async getUnprocessedAlerts(count: number): Promise<AnimalAlert[] | null> {
    const sql = `
      SELECT * FROM animals_alert_queue
      WHERE processed_at IS NULL
      ORDER BY created_at ASC
      LIMIT ${count}
    `;
    const animalDataSql = `
      SELECT * FROM animals WHERE animal_id = ?
    `;
    const habitatDataSql = `
      SELECT * FROM habitats WHERE habitat_id = ?
    `;
    const vetsSql = `
      SELECT email FROM employees
      WHERE job_role = 'veterinarian' AND deleted_at IS NULL
    `;
    const vets = await query<{ email: string }[]>(vetsSql);
    const veterinarianEmails = vets.map((vet) => vet.email);
    const results = await query<AnimalAlert[]>(sql);
    for (const alert of results) {
      const animalRows = await query<Animal[]>(animalDataSql, [alert.animal_id]);
      const animal = animalRows[0] || null;
    
      const habitatRows = animal
        ? await query<Habitat[]>(habitatDataSql, [animal.habitat_id])
        : [];
      const habitat = habitatRows[0] || null;
    
      alert.animal = animal;
      alert.habitat = habitat;
      alert.veterinarian_emails = veterinarianEmails;
    }
    return results.length > 0 ? results : null;
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
