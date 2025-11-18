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
                
          <p>
            I hope you're doing well. We wanted to bring your attention to a new alert
            that has been automatically generated for one of the animals under your care.
          </p>
                
          <p>Here are the details:</p>
                
          <h3>Animal Details</h3>
          <ul>
            <li><strong>Name:</strong> ${alert.animal?.name ?? "Unknown"}</li>
            <li><strong>Species:</strong> ${alert.animal?.species ?? "Unknown"}</li>
          </ul>

          <h3>Habitat Information</h3>
          <ul>
            <li><strong>Habitat:</strong> ${alert.habitat?.habitat_name ?? "Unknown"}</li>
          </ul>

          <h3>What Triggered the Alert</h3>
          <p>
            The system detected an event related to the animal’s
            <strong>${alert.alert_reason.replace("_", " ")}</strong>
            with a reported value of:
            <strong>${alert.alert_value}</strong>.
          </p>
                
          ${
            alert.medical_notes
              ? `
          <h3>Additional Notes</h3>
          <p>${alert.medical_notes}</p>
          `
              : ""
          }
        
          <p>
            We kindly ask that you review this situation at your earliest convenience
            and take the appropriate next steps. If there’s anything the Zoo Management
            System team can assist with, feel free to reach out.
          </p>
        
          <p>Thank you for your continued dedication and care.</p>
        
          <p>Warm regards,<br/>Zoo Management System</p>
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
          console.warn(
            `⚠️  No veterinarian emails found for animal ${alert.animal_id} alert. ` +
            `Alert will be marked as processed but no email was sent.`
          );
          // Still mark as processed - no point retrying if there are no vets to email
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
