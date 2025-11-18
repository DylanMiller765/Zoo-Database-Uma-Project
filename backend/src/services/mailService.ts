import * as nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter: nodemailer.Transporter;

export const initMailService = async () => {
  console.log('[MAIL SERVICE] Initializing mail service...');
  console.log('[MAIL SERVICE] MAIL_SERVICE:', process.env.MAIL_SERVICE);

  if (process.env.MAIL_SERVICE === "ethereal") {
    // Create a test account for Ethereal
    console.log('[MAIL SERVICE] Using Ethereal test email service');
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
    console.log('[MAIL SERVICE] Using Brevo SMTP service');
    console.log('[MAIL SERVICE] BREVO_HOST:', process.env.BREVO_HOST);
    console.log('[MAIL SERVICE] BREVO_PORT:', process.env.BREVO_PORT);
    console.log('[MAIL SERVICE] BREVO_USER:', process.env.BREVO_USER);
    console.log('[MAIL SERVICE] BREVO_KEY:', process.env.BREVO_KEY ? '***SET***' : 'NOT SET');
    console.log('[MAIL SERVICE] VERIFIED_SENDER_EMAIL:', process.env.VERIFIED_SENDER_EMAIL);

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
    console.log('[MAIL SERVICE] Verifying mail transporter...');
    await transporter.verify();
    console.log("✅ Mail transporter is ready to send emails");
  } catch (error) {
    console.error("❌ Error verifying mail transporter:", error);
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
    console.log("Email sent: " + info.response);
    if (process.env.MAIL_SERVICE === "ethereal") {
      console.log("Preview URL: " + nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};