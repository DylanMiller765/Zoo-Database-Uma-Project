import cron from 'node-cron';
import { AnimalAlertService } from '../services/animal-alert.service';

/**
 * Start the notification email job
 */
export function startAnimalAlertEmailJob(): void {
  // For demo: checking every 30 seconds for real-time feel
  const schedule = '*/30 * * * * *'; // Runs every 30 seconds
  const batchSize = 5;
  console.log('[Notification Email Job] Scheduling email processing job...');
  console.log(`[Notification Email Job] Schedule: Every 30 seconds (demo mode)`);

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
