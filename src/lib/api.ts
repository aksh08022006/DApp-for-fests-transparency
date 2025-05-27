import { generateVerificationToken, generateVerificationUrl } from "./token";
import {
  sendVerificationEmail,
  sendTicketConfirmationEmail,
} from "./emailService";
import * as db from "./database";
import * as blockchain from "./blockchain";

/**
 * Authenticate a club admin
 * @param email Club admin email
 * @param password Club admin password
 * @returns Authentication result
 */
export async function authenticateClubAdmin(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: any; error?: string }> {
  try {
    // Get the club admin by email
    const user = await db.getUserByEmail(email);

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    if (user.role !== "club") {
      return { success: false, error: "Invalid account type" };
    }

    // In a real app, we would verify the password hash here
    // For now, we'll just simulate a successful login

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Error authenticating club admin:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Authenticate a student
 * @param email Student email
 * @param password Student password
 * @returns Authentication result
 */
export async function authenticateStudent(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: any; error?: string }> {
  // Store user info in localStorage for persistence
  const storeUserInfo = (user: any) => {
    if (user) {
      localStorage.setItem("studentName", user.name || "");
      localStorage.setItem("studentId", user.id || "");
      localStorage.setItem("studentEmail", user.email || "");
    }
  };
  try {
    // Get the student by email
    const user = await db.getUserByEmail(email);

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    if (user.role !== "student") {
      return { success: false, error: "Invalid account type" };
    }

    // In a real app, we would verify the password hash here
    // For now, we'll just simulate a successful login

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
    };

    // Store user info in localStorage
    storeUserInfo(userData);

    return {
      success: true,
      user: userData,
    };
  } catch (error) {
    console.error("Error authenticating student:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Send a consent request to a student
 * @param eventId ID of the event
 * @param studentId ID of the student
 * @param studentEmail Student's email address
 * @param eventName Name of the event
 * @returns Result of the operation
 */
export async function sendConsentRequest(
  eventId: string,
  studentId: string,
  studentEmail: string,
  eventName: string,
): Promise<{ success: boolean; requestId?: string; error?: string }> {
  try {
    // Generate verification token
    const verificationToken = generateVerificationToken(
      studentEmail,
      `pending-${Date.now()}`,
      eventId,
    );

    // Create consent request in database
    const request = await db.createConsentRequest(
      eventId,
      studentId,
      verificationToken,
    );

    // Generate verification URL
    const verificationUrl = generateVerificationUrl(verificationToken);

    // Send verification email
    const emailResult = await sendVerificationEmail(
      studentEmail,
      `Ticket Consent Request for ${eventName}`,
      verificationUrl,
      eventName,
    );

    if (!emailResult.success) {
      throw new Error("Failed to send verification email");
    }

    return { success: true, requestId: request.id };
  } catch (error) {
    console.error("Error sending consent request:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Verify email for a consent request
 * @param token Verification token from email
 * @returns Result of the verification
 */
export async function verifyEmail(
  token: string,
): Promise<{ success: boolean; requestId?: string; error?: string }> {
  try {
    // Import and use the token module
    const tokenModule = await import("./token");
    const decoded = tokenModule.verifyToken(token);

    if (!decoded || decoded.purpose !== "email-verification") {
      throw new Error("Invalid or expired verification token");
    }

    // Mark the consent request as email verified
    const success = await db.verifyEmailForConsentRequest(decoded.requestId);

    if (!success) {
      throw new Error("Failed to verify consent request");
    }

    return { success: true, requestId: decoded.requestId };
  } catch (error) {
    console.error("Error verifying email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Complete the blockchain verification and issue a ticket
 * @param requestId ID of the consent request
 * @param walletAddress Student's wallet address
 * @returns Result of the operation with ticket details
 */
export async function completeBlockchainVerification(
  requestId: string,
  walletAddress: string,
): Promise<{
  success: boolean;
  ticketId?: string;
  transactionHash?: string;
  error?: string;
}> {
  try {
    // Get the consent request
    const request = await db.getConsentRequestById(requestId);

    if (!request) {
      throw new Error("Consent request not found");
    }

    if (!request.emailVerified) {
      throw new Error("Email verification not completed");
    }

    // Get event details
    const event = await db.getEventById(request.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    // Get student details
    const student = await db.getUserById(request.studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    // Update student's wallet address if provided
    if (walletAddress) {
      await db.updateUserWalletAddress(student.id, walletAddress);
    }

    // Generate ticket ID
    const ticketId = `ticket-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Issue ticket on blockchain
    const blockchainResult = await blockchain.issueTicket(
      event.id,
      student.id,
      ticketId,
    );

    if (!blockchainResult) {
      throw new Error("Failed to issue ticket on blockchain");
    }

    // Mark consent request as completed
    const updated = await db.completeBlockchainVerification(
      requestId,
      blockchainResult.transactionHash,
    );

    if (!updated) {
      throw new Error("Failed to update consent request status");
    }

    // Get the created ticket
    const ticket = await db.getTicketById(ticketId);
    if (!ticket) {
      throw new Error("Failed to retrieve created ticket");
    }

    // Send ticket confirmation email
    await sendTicketConfirmationEmail(
      student.email,
      {
        name: event.name,
        date: event.date,
        time: event.time,
        location: event.location,
        organizer: event.organizer,
      },
      ticket.id,
      ticket.qrCode,
    );

    return {
      success: true,
      ticketId: ticket.id,
      transactionHash: blockchainResult.transactionHash,
    };
  } catch (error) {
    console.error("Error completing blockchain verification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

/**
 * Get all pending consent requests for a student
 * @param studentId ID of the student
 * @returns List of consent requests
 */
export async function getStudentConsentRequests(studentId: string) {
  try {
    const requests = await db.getConsentRequestsByStudentId(studentId);

    // Enrich with event details
    const enrichedRequests = await Promise.all(
      requests.map(async (request) => {
        const event = await db.getEventById(request.eventId);
        return {
          ...request,
          eventName: event?.name || "Unknown Event",
          eventDate: event?.date || "",
          eventTime: event?.time || "",
          eventLocation: event?.location || "",
          organizer: event?.organizer || "",
        };
      }),
    );

    return { success: true, requests: enrichedRequests };
  } catch (error) {
    console.error("Error getting student consent requests:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      requests: [],
    };
  }
}

/**
 * Get all tickets for a student
 * @param studentId ID of the student
 * @returns List of tickets with event details
 */
/**
 * Create a new event
 * @param eventData Event data to create
 * @returns Result with created event
 */
export async function createEvent(eventData: {
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer: string;
  organizerId: string;
  capacity: number;
  category: string;
  image?: string;
  status: "upcoming" | "past" | "cancelled";
}): Promise<{ success: boolean; event?: any; error?: string }> {
  try {
    // Validate required fields
    if (!eventData.name || !eventData.date || !eventData.organizer) {
      return { success: false, error: "Missing required event information" };
    }

    // Create the event in the database
    const newEvent = await db.createEvent(eventData);

    return { success: true, event: newEvent };
  } catch (error) {
    console.error("Error creating event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getStudentTickets(studentId: string) {
  try {
    const tickets = await db.getTicketsByStudentId(studentId);

    // Enrich with event details
    const enrichedTickets = await Promise.all(
      tickets.map(async (ticket) => {
        const event = await db.getEventById(ticket.eventId);
        return {
          ...ticket,
          eventName: event?.name || "Unknown Event",
          eventDate: event?.date || "",
          eventTime: event?.time || "",
          eventLocation: event?.location || "",
          organizer: event?.organizer || "",
        };
      }),
    );

    return { success: true, tickets: enrichedTickets };
  } catch (error) {
    console.error("Error getting student tickets:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
      tickets: [],
    };
  }
}
