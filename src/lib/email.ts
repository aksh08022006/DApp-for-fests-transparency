import nodemailer from "nodemailer";

// Configure email transporter
const transporter = nodemailer.createTransport({
  // For development/testing, you can use services like Mailtrap or Ethereal
  // For production, use your actual SMTP settings
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

/**
 * Send verification email to user
 * @param to Recipient email address
 * @param subject Email subject
 * @param verificationLink Link for email verification
 * @param eventName Name of the event (optional)
 */
export async function sendVerificationEmail(
  to: string,
  subject: string,
  verificationLink: string,
  eventName?: string,
) {
  try {
    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        "College Event Ticketing <noreply@collegeevent.com>",
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4f46e5;">College Event Ticketing</h2>
          <p>Hello,</p>
          <p>You have received a ticket consent request${eventName ? ` for <strong>${eventName}</strong>` : ""}.</p>
          <p>Please click the button below to verify your email and proceed with the consent process:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
          </div>
          <p>If you did not request this verification, please ignore this email.</p>
          <p>This link will expire in 24 hours.</p>
          <p>Thank you,<br>College Event Ticketing Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

/**
 * Send ticket confirmation email
 * @param to Recipient email address
 * @param eventDetails Event details object
 * @param ticketId Unique ticket identifier
 * @param qrCodeUrl URL to the QR code image
 */
export async function sendTicketConfirmationEmail(
  to: string,
  eventDetails: {
    name: string;
    date: string;
    time: string;
    location: string;
    organizer: string;
  },
  ticketId: string,
  qrCodeUrl: string,
) {
  try {
    const mailOptions = {
      from:
        process.env.EMAIL_FROM ||
        "College Event Ticketing <noreply@collegeevent.com>",
      to,
      subject: `Your Ticket for ${eventDetails.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4f46e5;">Your Ticket is Confirmed!</h2>
          <p>Hello,</p>
          <p>Your ticket for <strong>${eventDetails.name}</strong> has been confirmed and issued on the blockchain.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Event Details:</h3>
            <p><strong>Date:</strong> ${eventDetails.date}</p>
            <p><strong>Time:</strong> ${eventDetails.time}</p>
            <p><strong>Location:</strong> ${eventDetails.location}</p>
            <p><strong>Organizer:</strong> ${eventDetails.organizer}</p>
            <p><strong>Ticket ID:</strong> ${ticketId}</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <img src="${qrCodeUrl}" alt="Ticket QR Code" style="max-width: 200px; height: auto;" />
            <p style="margin-top: 10px;">Present this QR code at the event entrance</p>
          </div>
          
          <p>Thank you for using College Event Ticketing!</p>
          <p>Best regards,<br>College Event Ticketing Team</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Ticket confirmation email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("Error sending ticket confirmation email:", error);
    return { success: false, error };
  }
}
