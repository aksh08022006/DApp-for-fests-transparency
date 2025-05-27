import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";

// Secret key for JWT signing - in production, use environment variables
const JWT_SECRET =
  process.env.JWT_SECRET || "your-secret-key-change-in-production";

// Token expiration time (24 hours in seconds)
const TOKEN_EXPIRATION = 60 * 60 * 24;

/**
 * Generate a verification token for email verification
 * @param email User's email address
 * @param requestId ID of the consent request
 * @param eventId ID of the event
 * @returns JWT token string
 */
export function generateVerificationToken(
  email: string,
  requestId: string,
  eventId: string,
): string {
  return jwt.sign(
    {
      email,
      requestId,
      eventId,
      purpose: "email-verification",
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRATION },
  );
}

/**
 * Verify a token and return the decoded data
 * @param token JWT token to verify
 * @returns Decoded token data or null if invalid
 */
export function verifyToken(token: string): any | null {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

/**
 * Generate a secure hash for a ticket
 * @param ticketData Ticket data to hash
 * @returns Hashed string
 */
export function generateTicketHash(ticketData: any): string {
  return CryptoJS.SHA256(JSON.stringify(ticketData)).toString();
}

/**
 * Generate a verification URL with the token
 * @param token JWT token
 * @returns Full verification URL
 */
export function generateVerificationUrl(token: string): string {
  const baseUrl = process.env.APP_URL || "http://localhost:5173";
  return `${baseUrl}/verify-email?token=${encodeURIComponent(token)}`;
}
