/**
 * Browser-compatible email service that delegates to backend API
 */

interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: any;
}

/**
 * Send verification email to user via backend API
 */
export async function sendVerificationEmail(
  to: string,
  subject: string,
  verificationLink: string,
  eventName?: string,
): Promise<EmailResult> {
  try {
    // In a real implementation, this would call your backend API
    // For now, we'll simulate a successful response
    console.log("Sending verification email to:", to);
    console.log("Subject:", subject);
    console.log("Verification link:", verificationLink);
    console.log("Event name:", eventName);

    // Simulate API call
    // const response = await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ to, subject, verificationLink, eventName, type: 'verification' })
    // });
    // const data = await response.json();
    // return data;

    // Mock successful response
    return { success: true, messageId: `mock-${Date.now()}` };
  } catch (error) {
    console.error("Error sending verification email:", error);
    return { success: false, error };
  }
}

/**
 * Send ticket confirmation email via backend API
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
): Promise<EmailResult> {
  try {
    // In a real implementation, this would call your backend API
    // For now, we'll simulate a successful response
    console.log("Sending ticket confirmation email to:", to);
    console.log("Event details:", eventDetails);
    console.log("Ticket ID:", ticketId);
    console.log("QR Code URL:", qrCodeUrl);

    // Simulate API call
    // const response = await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to,
    //     eventDetails,
    //     ticketId,
    //     qrCodeUrl,
    //     type: 'ticketConfirmation'
    //   })
    // });
    // const data = await response.json();
    // return data;

    // Mock successful response
    return { success: true, messageId: `mock-${Date.now()}` };
  } catch (error) {
    console.error("Error sending ticket confirmation email:", error);
    return { success: false, error };
  }
}
