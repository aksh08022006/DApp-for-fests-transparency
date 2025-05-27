import CryptoJS from "crypto-js";
import { jwtDecode } from "jwt-decode";

// Note: This is a client-side implementation
// In a production app, token generation and verification should happen server-side

// Mock token generation for demo purposes only
// In a real app, this would be done on the server
const MOCK_SECRET = "demo-secret-not-for-production";

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
  // This is a simplified mock implementation for demo purposes
  // In a real app, token generation would happen on the server
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      email,
      requestId,
      eventId,
      purpose: "email-verification",
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
    }),
  );
  const signature = btoa(
    CryptoJS.HmacSHA256(`${header}.${payload}`, MOCK_SECRET).toString(),
  );

  return `${header}.${payload}.${signature}`;
}

/**
 * Decode a token and return the data
 * @param token JWT token to decode
 * @returns Decoded token data or null if invalid
 */
export function verifyToken(token: string): any | null {
  try {
    // In a real app, verification would happen on the server
    // This is just decoding the token without verifying the signature
    const decoded = jwtDecode(token);

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      console.error("Token expired");
      return null;
    }

    return decoded;
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
