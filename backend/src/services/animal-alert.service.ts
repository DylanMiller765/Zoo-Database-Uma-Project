import { AnimalAlert } from "../types/animal-alert.types";
import { AnimalAlertModel } from "../models/animal-alert.model";
import { sendMail } from "./mailService";
import { EmployeeModel } from "../models/employee.model";
import { AnimalModel } from "../models/animal.model";
import dotenv from "dotenv";
dotenv.config();

export class AnimalAlertService {
  /**
   * Process unprocessed animal alerts and send notification emails
   */
  static async processAnimalAlerts(batchSize: number = 5): Promise<void> {
    const unprocessedAlerts: AnimalAlert[] | null =
      await AnimalAlertModel.getUnprocessedAlerts(batchSize);

    if (unprocessedAlerts) {
      for (const alert of unprocessedAlerts) {
        // Todo Make the animal email more personalized and more details.

        // Construct email content based on alert details
        const subject = `Animal Alert: ${alert.alert_reason
          .replace("_", " ")
          .toUpperCase()}`;
        const body = `
        <p>Dear Veterinarian,</p>
        <p>An alert has been generated for Animal ID: ${alert.animal_id}.</p>
        <p>Reason: ${alert.alert_reason.replace("_", " ")}</p>
        <p>Value: ${alert.alert_value}</p>
        <p>Please take the necessary actions.</p>
        <p>Regards,<br/>Zoo Management System</p>
      `;

        // Send email to each veterinarian
        for (const email of alert.veterinarian_emails || []) {
          await sendMail({
            from: `"Zoo Verse 12" <${process.env.VERIFIED_SENDER_EMAIL}>`,
            to: email,
            subject,
            text: `An alert has been generated for Animal ID: ${
              alert.animal_id
            }. Reason: ${alert.alert_reason.replace("_", " ")}. Value: ${
              alert.alert_value
            }. Please take the necessary actions.`,
            html: body,
          });
        }
        if (
          alert.veterinarian_emails === undefined ||
          alert.veterinarian_emails.length === 0
        ) {
          try {
            await sendMail({
              from: `"Zoo Verse 12" <${process.env.VERIFIED_SENDER_EMAIL}>`,
              to: "abdullahshittu.work@gmail.com",
              subject,
              text: `An alert has been generated for Animal ID: ${
                alert.animal_id
              }. Reason: ${alert.alert_reason.replace("_", " ")}. Value: ${
                alert.alert_value
              }. Please take the necessary actions.`,
              html: body,
            });
          } catch (error) {
            console.error(
              "Failed to send alert email to default address:",
              error
            );
            continue; //skip marking as processed if email fails
          }
        }

        //Mark only if the email was truly sent
        // IS there any way to confirm email was sent successfully?
        // For now, we assume it was sent if no error was thrown
        // Can you write the code to check if an error was thrown during sendMail?
        await AnimalAlertModel.markAlertAsProcessed(
          alert.animal_alert_id as number
        );
        // Mark the alert as processed
      }
    }
  }
}
