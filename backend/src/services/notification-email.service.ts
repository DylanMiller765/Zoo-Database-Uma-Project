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

      // Extract event details from notification message
      const eventDetails = this.parseEventCancellationMessage(notification.message);

      // Send email (in production, use real email provider)
      await this.sendEmail({
        to: customer.email,
        toName: `${customer.first_name} ${customer.last_name}`,
        subject: eventDetails.subject,
        body: this.formatEmailBody(customer, notification.message, eventDetails),
      });

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
   * Format email body with HTML template
   */
  private static formatEmailBody(
    customer: Customer,
    notificationMessage: string,
    eventDetails: { eventName: string; eventDate: string }
  ): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
    .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; }
    .event-details { background-color: white; padding: 15px; margin: 20px 0; border-left: 4px solid #dc2626; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .alert-box { background-color: #fef2f2; border: 1px solid #dc2626; padding: 15px; margin: 15px 0; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚠️ Event Cancellation Notice</h1>
    </div>

    <div class="content">
      <p>Dear ${customer.first_name} ${customer.last_name},</p>

      <p>We regret to inform you that an event you registered for has been cancelled.</p>

      <div class="event-details">
        <h3>${eventDetails.eventName}</h3>
        <p><strong>Originally Scheduled:</strong> ${eventDetails.eventDate}</p>
      </div>

      <div class="alert-box">
        ${notificationMessage.replace(/CANCELLATION: The event[^.]+\.\s*/, '')}
      </div>

      <p>We sincerely apologize for any inconvenience this may cause. Our team is working to ensure this doesn't happen again.</p>

      <p>If you have any questions or concerns, please don't hesitate to contact our customer service team.</p>

      <p>Thank you for your understanding.</p>

      <p>Sincerely,<br>
      <strong>Zoo Management Team</strong></p>
    </div>

    <div class="footer">
      <p>This is an automated notification. Please do not reply to this email.</p>
      <p>&copy; 2025 Zoo Management System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Send email using email provider
   *
   * DEMO MODE: Currently logs to console
   * PRODUCTION: Replace with actual email provider (SendGrid, AWS SES, Nodemailer)
   */
  private static async sendEmail(params: {
    to: string;
    toName: string;
    subject: string;
    body: string;
  }): Promise<void> {
    // ============================================================
    // DEMO MODE: Log email to console
    // ============================================================
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 EMAIL NOTIFICATION (DEMO MODE)');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`To: ${params.toName} <${params.to}>`);
    console.log(`Subject: ${params.subject}`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Body (HTML):');
    console.log(params.body.substring(0, 500) + '...\n');

    // ============================================================
    // PRODUCTION MODE: Uncomment and configure email provider
    // ============================================================

    /*
    // Example with Nodemailer (SMTP)
    const nodemailer = require('nodemailer');

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: '"Zoo Notifications" <notifications@zoo.com>',
      to: params.to,
      subject: params.subject,
      html: params.body,
    });
    */

    /*
    // Example with SendGrid
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    await sgMail.send({
      to: params.to,
      from: 'notifications@zoo.com',
      subject: params.subject,
      html: params.body,
    });
    */

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 100));
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
