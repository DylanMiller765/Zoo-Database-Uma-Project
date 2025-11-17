import * as nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

let transporter: nodemailer.Transporter;

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