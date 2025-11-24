import * as nodemailer from "nodemailer";
import * as brevo from "@getbrevo/brevo";
import dotenv from "dotenv";

dotenv.config();

let transporter: nodemailer.Transporter | null = null;
let brevoApiClient: brevo.TransactionalEmailsApi | null = null;

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
  const mode = process.env.MAIL_SERVICE || "ethereal";

  if (mode === "ethereal") {
    // ============================================================
    // TEST MODE: Ethereal (fake inbox for testing)
    // ============================================================
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
      "✅ [ETHEREAL] Test mode enabled. View emails at: https://ethereal.email/"
    );
  } else if (mode === "api") {
    // ============================================================
    // API MODE: Brevo API (works on Railway - no SMTP ports needed!)
    // ============================================================
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      throw new Error(
        "BREVO_API_KEY is required when MAIL_SERVICE=api. " +
          "Get your API key from: https://app.brevo.com/settings/keys/api"
      );
    }

    const apiInstance = new brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);
    brevoApiClient = apiInstance;

    console.log(
      "✅ [BREVO API] Email service ready (uses HTTPS - works on Railway!)"
    );
  } else if (mode === "smtp") {
    // ============================================================
    // SMTP MODE: Brevo SMTP (may not work on Railway free tier!)
    // ============================================================
    transporter = nodemailer.createTransport({
      host: process.env.BREVO_HOST,
      port: Number(process.env.BREVO_PORT),
      secure: false, // Port 587 uses STARTTLS
      auth: {
        user: process.env.BREVO_USER, // Your Brevo Login
        pass: process.env.BREVO_KEY, // Your Brevo SMTP Key
      },
    });

    try {
      await transporter.verify();
      console.log(
        "✅ [BREVO SMTP] Mail transporter ready (may be blocked on Railway free tier)"
      );
    } catch (error) {
      console.error("❌ [BREVO SMTP] Error verifying mail transporter:", error);
      console.error(
        "💡 TIP: If on Railway, try MAIL_SERVICE=api instead of smtp"
      );
    }
  } else {
    // ============================================================
    // INVALID MODE
    // ============================================================
    throw new Error(
      `Invalid MAIL_SERVICE="${mode}". Valid options: "ethereal", "api", "smtp". ` +
        `For Railway, use MAIL_SERVICE=api`
    );
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
  const mode = process.env.MAIL_SERVICE || "ethereal";

  if (mode === "api") {
    // ============================================================
    // Send via Brevo API
    // ============================================================
    if (!brevoApiClient) {
      console.error(
        "Mail service not initialized! Call initMailService() first."
      );
      return;
    }

    try {
      // Parse email addresses
      const fromMatch = inputs.from.match(/<(.+)>/) || [null, inputs.from];
      const fromEmail = fromMatch[1] || inputs.from;
      const fromName = inputs.from.replace(/<.+>/, "").replace(/"/g, "").trim();

      // Create Brevo email object
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      sendSmtpEmail.sender = { email: fromEmail, name: fromName };
      sendSmtpEmail.to = [{ email: inputs.to }];
      sendSmtpEmail.subject = inputs.subject;
      sendSmtpEmail.textContent = inputs.text;
      if (inputs.html) {
        sendSmtpEmail.htmlContent = inputs.html;
      }

      const response = await brevoApiClient.sendTransacEmail(sendSmtpEmail);

      // Track email after successful send
      trackEmail(inputs.to, inputs.subject, false);

      console.log("Email sent via API: " + response.body.messageId);
      return response;
    } catch (error) {
      console.error("Error sending email via API:", error);
      throw error;
    }
  } else if (mode === "ethereal" || mode === "smtp") {
    // ============================================================
    // Send via SMTP (Ethereal or Brevo SMTP)
    // ============================================================
    if (!transporter) {
      console.error(
        "Mail service not initialized! Call initMailService() first."
      );
      return;
    }

    try {
      const info = await transporter.sendMail(inputs);

      // Track email after successful send
      const isTestMode = mode === "ethereal";
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
  } else {
    throw new Error(
      `Invalid MAIL_SERVICE="${mode}". Valid options: "ethereal", "api", "smtp".`
    );
  }
};