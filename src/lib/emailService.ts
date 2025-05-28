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
 * Now includes MetaMask integration for blockchain consent
 */
export async function sendVerificationEmail(
  to: string,
  subject: string,
  verificationLink: string,
  eventName?: string,
  requestId?: string,
): Promise<EmailResult> {
  try {
    // In a real implementation, this would call your backend API
    // For now, we'll simulate a successful response
    console.log("Sending verification email to:", to);
    console.log("Subject:", subject);
    console.log("Verification link:", verificationLink);
    console.log("Event name:", eventName);
    console.log("Consent request ID:", requestId);

    // Create HTML email content with MetaMask instructions
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Email for ${eventName || "Event"} Ticket</h2>
        <p>You've received this email because a request was made for a ticket to ${eventName || "an event"}.</p>
        <p>To verify your email and proceed with the blockchain consent process:</p>
        <ol>
          <li>Click the verification link below</li>
          <li>You will be prompted to connect your MetaMask wallet</li>
          <li>Sign the transaction to provide consent for ticket issuance</li>
        </ol>
        <p>
          <a href="${verificationLink}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
            Verify Email & Connect Wallet
          </a>
        </p>
        <p>This link will expire in 24 hours.</p>
        <p>If you did not request this ticket, please ignore this email.</p>
        <hr>
        <p style="font-size: 12px; color: #666;">
          This is a secure blockchain-based ticketing system. Your consent will be recorded on the blockchain for transparency and security.
        </p>
      </div>
    `;

    // Simulate API call with HTML content
    // const response = await fetch('/api/send-email', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to,
    //     subject,
    //     verificationLink,
    //     eventName,
    //     requestId,
    //     htmlContent: emailContent,
    //     type: 'verification'
    //   })
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
