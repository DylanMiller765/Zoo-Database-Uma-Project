/**
 * Notification Email Service
 *
 * This service handles sending email notifications to customers.
 * It runs as a scheduled job (cron) that polls the notifications table
 * for unprocessed alerts and sends emails accordingly.
 *
 * For demonstration purposes, this implementation logs emails to console.
 * In production, integrate with an email provider like SendGrid, AWS SES, or Nodemailer with SMTP.
 */

import { query } from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { sendMail } from './mailService';
import { NotificationModel } from '../models/notification.model';

interface Notification extends RowDataPacket {
  notification_id: number;
  customer_id: number;
  message: string;
  notification_type: 'info' | 'warning' | 'alert';
  created_at: Date;
}

interface Customer extends RowDataPacket {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
}

export class NotificationEmailService {
  /**
   * Process pending email notifications
   * This method should be called by a scheduled job (e.g., every 5 minutes)
   */
  static async processPendingEmails(): Promise<void> {
    try {
      console.log('[Email Service] Processing pending email notifications...');

      // Get all unprocessed alert notifications
      const notifications = await query<Notification[]>(
        `SELECT notification_id, customer_id, message, notification_type, created_at
         FROM notifications
         WHERE notification_type = 'alert'
           AND is_read = FALSE
         ORDER BY created_at ASC
         LIMIT 50`  // Process in batches of 50
      );

      if (notifications.length === 0) {
        console.log('[Email Service] No pending notifications to process.');
        return;
      }

      console.log(`[Email Service] Found ${notifications.length} notifications to process.`);

      // Process each notification
      for (const notification of notifications) {
        await this.sendNotificationEmail(notification);
      }

      console.log('[Email Service] Batch processing complete.');
    } catch (error) {
      console.error('[Email Service] Error processing pending emails:', error);
      throw error;
    }
  }

  /**
   * Send email for a specific notification
   */
  private static async sendNotificationEmail(notification: Notification): Promise<void> {
    try {
      // Get customer details
      const customers = await query<Customer[]>(
        `SELECT customer_id, first_name, last_name, email
         FROM customers
         WHERE customer_id = ? AND deleted_at IS NULL`,
        [notification.customer_id]
      );

      if (customers.length === 0) {
        console.warn(`[Email Service] Customer ${notification.customer_id} not found or deleted. Skipping.`);
        return;
      }

      const customer = customers[0];

      if (!customer.email) {
        console.warn(`[Email Service] Customer ${notification.customer_id} has no email address. Skipping.`);
        return;
      }

      // Skip test emails ending with "@email" to avoid wasting API credits
      if (customer.email.endsWith('@email')) {
        console.log(`[Email Service] Skipping test email ${customer.email} (ends with @email). Not wasting API credits.`);
        return;
      }

      // Extract event details from notification message
      const eventDetails = this.parseEventCancellationMessage(notification.message);

      // Send email (in production, use real email provider)
      await this.sendEmail({
        to: customer.email,
        toName: `${customer.first_name} ${customer.last_name}`,
        subject: eventDetails.subject,
        body: this.formatEmailBody(customer, notification.message, eventDetails),
      });

      // Mark notification as read so it's not sent again
      await NotificationModel.markAsRead(notification.notification_id);

      console.log(`[Email Service] ✅ Email sent to ${customer.email} for notification #${notification.notification_id}`);
    } catch (error) {
      console.error(`[Email Service] ❌ Failed to send email for notification #${notification.notification_id}:`, error);
    }
  }

  /**
   * Parse event cancellation message to extract details
   */
  private static parseEventCancellationMessage(message: string): {
    eventName: string;
    eventDate: string;
    subject: string;
  } {
    // Example message: "CANCELLATION: The event "Penguin Feeding" scheduled for February 14, 2025 at 02:00 PM has been cancelled..."
    const eventNameMatch = message.match(/event "([^"]+)"/);
    const eventDateMatch = message.match(/scheduled for ([^h]+)/);

    const eventName = eventNameMatch ? eventNameMatch[1] : 'Event';
    const eventDate = eventDateMatch ? eventDateMatch[1].trim() : 'TBD';

    return {
      eventName,
      eventDate,
      subject: `Event Cancellation - ${eventName}`,
    };
  }

  /**
   * Format email body with HTML template - matches animal alert style
   */
  private static formatEmailBody(
    customer: Customer,
    notificationMessage: string,
    eventDetails: { eventName: string; eventDate: string }
  ): string {
    return `
      <p>Dear ${customer.first_name} ${customer.last_name},</p>

      <p>
        We regret to inform you that an event you registered for has been cancelled.
        We sincerely apologize for any inconvenience this may cause.
      </p>

      <h3>📅 Event Details</h3>
      <ul>
        <li><strong>Event:</strong> ${eventDetails.eventName}</li>
        <li><strong>Originally Scheduled:</strong> ${eventDetails.eventDate}</li>
      </ul>

      <h3>💰 Refund Information</h3>
      <p>
        A full refund has been automatically processed for your registration.
        Please allow 3-5 business days for the refund to appear in your original payment method.
      </p>

      <p>
        If you have any questions about this cancellation or your refund,
        please don't hesitate to contact our customer service team.
      </p>

      <p>Thank you for your understanding and continued support.</p>

      <p>Warm regards,<br/>Zoo Management Team</p>
    `.trim();
  }

  /**
   * Send email using mailService
   */
  private static async sendEmail(params: {
    to: string;
    toName: string;
    subject: string;
    body: string;
  }): Promise<void> {
    try {
      await sendMail({
        from: `"Zoo Notifications" <${process.env.VERIFIED_SENDER_EMAIL || 'noreply@zoo.com'}>`,
        to: params.to,
        subject: params.subject,
        html: params.body,
        text: `Event Cancellation Notification for ${params.toName}`, // Plain text fallback
      });
    } catch (error) {
      console.error(`[Email Service] Error sending email via mailService:`, error);
      throw error;
    }
  }

  /**
   * Manual trigger to send emails for a specific event cancellation
   * Useful for testing or immediate processing
   */
  static async sendEventCancellationEmails(eventId: number): Promise<void> {
    try {
      console.log(`[Email Service] Sending emails for event ${eventId}...`);

      const notifications = await query<Notification[]>(
        `SELECT n.notification_id, n.customer_id, n.message, n.notification_type, n.created_at
         FROM notifications n
         JOIN event_registrations er ON er.customer_id = n.customer_id
         WHERE er.event_id = ?
           AND n.notification_type = 'alert'
           AND n.message LIKE 'CANCELLATION:%'
         ORDER BY n.created_at DESC`,
        [eventId]
      );

      console.log(`[Email Service] Found ${notifications.length} notifications for event ${eventId}.`);

      for (const notification of notifications) {
        await this.sendNotificationEmail(notification);
      }

      console.log('[Email Service] Event cancellation emails sent.');
    } catch (error) {
      console.error('[Email Service] Error sending event cancellation emails:', error);
      throw error;
    }
  }
}
