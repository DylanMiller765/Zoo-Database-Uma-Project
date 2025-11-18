import cron from 'node-cron';
import { AnimalAlertService } from '../services/animal-alert.service';

/**
 * Start the notification email job
 */
export function startAnimalAlertEmailJob(): void {
  // Run every 8 seconds
  const schedule = '*/8 * * * * *';
  const batchSize = 5;
  console.log('[Animal Alert Email Job] Scheduling email processing job...');
  console.log(`[Animal Alert Email Job] Schedule: Every 8 seconds`);

  cron.schedule(schedule, async () => {
    console.log(`\n[${new Date().toISOString()}] Running notification email job...`);

    try {
      await AnimalAlertService.processAnimalAlerts(batchSize);
    } catch (error) {
      console.error('[Notification Email Job] Job failed:', error);
    }
  });

  console.log('[Notification Email Job] ✅ Job scheduled successfully.');
}

/**
 * Manually trigger the email job (for testing)
 */
export async function runAnimalAlertEmailJobNow(): Promise<void> {
  console.log('[Notification Email Job] Manual trigger...');

  try {
    await AnimalAlertService.processAnimalAlerts();
    console.log('[Notification Email Job] ✅ Manual trigger completed.');
  } catch (error) {
    console.error('[Notification Email Job] ❌ Manual trigger failed:', error);
    throw error;
  }
}
