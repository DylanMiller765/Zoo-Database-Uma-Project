import * as nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter: nodemailer.Transporter;

// ============================================================
// EMAIL TRACKING SYSTEM
// Track daily email usage to stay under 300/day limit
// ============================================================
interface EmailStats {
  date: string;
  count: number;
  emails: Array<{
    timestamp: Date;
    to: string;
    subject: string;
    mode: "test" | "production";
  }>;
}

let dailyStats: EmailStats = {
  date: new Date().toISOString().split("T")[0],
  count: 0,
  emails: [],
};

// Reset counter at midnight
function checkAndResetDailyStats() {
  const today = new Date().toISOString().split("T")[0];
  if (dailyStats.date !== today) {
    if (dailyStats.count > 0) {
      console.log(
        `📊 Previous day (${dailyStats.date}) email stats: ${dailyStats.count} emails sent`
      );
    }
    dailyStats = {
      date: today,
      count: 0,
      emails: [],
    };
  }
}

// Track email being sent
function trackEmail(to: string, subject: string, isTest: boolean) {
  checkAndResetDailyStats();

  dailyStats.count++;
  dailyStats.emails.push({
    timestamp: new Date(),
    to,
    subject,
    mode: isTest ? "test" : "production",
  });

  const mode = isTest ? "TEST" : "PRODUCTION";
  console.log(`📧 [${mode}] Email #${dailyStats.count} sent to: ${to}`);

  // Warning at 80% of limit (240 emails)
  if (!isTest && dailyStats.count >= 240 && dailyStats.count < 300) {
    console.warn(
      `⚠️  WARNING: ${dailyStats.count}/300 daily emails sent (${Math.round((dailyStats.count/300)*100)}%). Approaching limit!`
    );
  }

  // Alert at 90% of limit (270 emails)
  if (!isTest && dailyStats.count >= 270 && dailyStats.count < 300) {
    console.error(
      `🚨 ALERT: ${dailyStats.count}/300 daily emails sent (${Math.round((dailyStats.count/300)*100)}%). Very close to limit!`
    );
  }

  // Error at limit
  if (!isTest && dailyStats.count >= 300) {
    console.error(
      `❌ LIMIT REACHED: ${dailyStats.count}/300 daily emails sent. You may be throttled by Brevo!`
    );
  }
}

// Get current stats (useful for debugging)
export function getEmailStats() {
  checkAndResetDailyStats();
  return {
    ...dailyStats,
    limit: 300,
    remaining: Math.max(0, 300 - dailyStats.count),
    percentUsed: Math.round((dailyStats.count / 300) * 100),
  };
}

export const initMailService = async () => {
  if (process.env.MAIL_SERVICE === "ethereal") {
    // Create a test account for Ethereal
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(
      "Ethereal test account created. You can view sent emails at https://ethereal.email/"
    );
  } else {
    // Use real email service
    //Use Brevo ENV Keys
    transporter = nodemailer.createTransport({
      host: process.env.BREVO_HOST,
      port: Number(process.env.BREVO_PORT),
      secure: false, // Port 587 is not secure
      auth: {
        user: process.env.BREVO_USER, // Your Brevo Login
        pass: process.env.BREVO_KEY, // Your Brevo SMTP Key
      },
    });
  }

  try {
    await transporter.verify();
    console.log("Mail transporter is ready to send emails");
  } catch (error) {
    console.error("Error verifying mail transporter:", error);
  }
};

// Create a type for MailOptions
type MailOptions = {
  from: string;
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export const sendMail = async (inputs: MailOptions) => {
  if (!transporter) {
    console.error(
      "Mail service not initialized! Call initMailService() first."
    );
    return; // Return undefined if not initialized
  }

  try {
    const info = await transporter.sendMail(inputs);

    // Track email after successful send
    const isTestMode = process.env.MAIL_SERVICE === "ethereal";
    trackEmail(inputs.to, inputs.subject, isTestMode);

    console.log("Email sent: " + info.response);
    if (isTestMode) {
      console.log("Preview URL: " + nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};