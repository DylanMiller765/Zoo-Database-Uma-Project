/**
 * Notification Email Job
 *
 * Scheduled job that runs periodically to process pending email notifications.
 * Uses node-cron to schedule the job.
 *
 * Schedule: Every 5 minutes
 */

import cron from 'node-cron';
import { NotificationEmailService } from '../services/notification-email.service';

/**
 * Start the notification email job
 */
export function startNotificationEmailJob(): void {
  // Run every 5 minutes: */5 * * * *
  // For testing, you can change to every minute: * * * * *
  const schedule = '*/5 * * * *';

  console.log('[Notification Email Job] Scheduling email processing job...');
  console.log(`[Notification Email Job] Schedule: Every 5 minutes`);

  cron.schedule(schedule, async () => {
    console.log(`\n[${new Date().toISOString()}] Running notification email job...`);

    try {
      await NotificationEmailService.processPendingEmails();
    } catch (error) {
      console.error('[Notification Email Job] Job failed:', error);
    }
  });

  console.log('[Notification Email Job] ✅ Job scheduled successfully.');
}

/**
 * Manually trigger the email job (for testing)
 */
export async function runNotificationEmailJobNow(): Promise<void> {
  console.log('[Notification Email Job] Manual trigger...');

  try {
    await NotificationEmailService.processPendingEmails();
    console.log('[Notification Email Job] ✅ Manual trigger completed.');
  } catch (error) {
    console.error('[Notification Email Job] ❌ Manual trigger failed:', error);
    throw error;
  }
}
