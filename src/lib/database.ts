// This is a mock database service for development
// In production, replace with actual database calls (Supabase, Firebase, etc.)

// Types for our data models
export interface User {
  id: string;
  email: string;
  name: string;
  role: "student" | "club";
  walletAddress?: string;
  department?: string;
  verified: boolean;
}

export interface Event {
  id: string;
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
}

export interface ConsentRequest {
  id: string;
  eventId: string;
  studentId: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  emailVerified: boolean;
  blockchainVerified: boolean;
  verificationToken?: string;
  verificationExpiry?: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  studentId: string;
  issueDate: string;
  status: "active" | "used" | "expired";
  qrCode: string;
  transactionHash?: string;
}

// Mock database storage
const db = {
  users: new Map<string, User>(),
  events: new Map<string, Event>(),
  consentRequests: new Map<string, ConsentRequest>(),
  tickets: new Map<string, Ticket>(),
  verificationTokens: new Map<
    string,
    { userId: string; requestId: string; expires: Date }
  >(),
};

// Initialize with some sample data
function initializeMockData() {
  // Sample users
  const users: User[] = [
    {
      id: "student1",
      email: "john.doe@college.edu",
      name: "John Doe",
      role: "student",
      department: "Computer Science",
      verified: true,
    },
    {
      id: "club1",
      email: "tech.club@college.edu",
      name: "Tech Club Admin",
      role: "club",
      verified: true,
    },
  ];

  // Sample events
  const events: Event[] = [
    {
      id: "event1",
      name: "Tech Fest 2023",
      date: "2023-12-15",
      time: "10:00 AM",
      location: "Main Auditorium",
      description:
        "Annual technology festival featuring workshops, competitions, and tech talks from industry experts.",
      organizer: "Computer Science Club",
      organizerId: "club1",
      capacity: 200,
      category: "tech",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      status: "upcoming",
    },
  ];

  // Add data to our mock database
  users.forEach((user) => db.users.set(user.id, user));
  events.forEach((event) => db.events.set(event.id, event));
}

// Initialize the mock database
initializeMockData();

// User related functions
export async function getUserByEmail(email: string): Promise<User | null> {
  for (const user of db.users.values()) {
    if (user.email === email) {
      return user;
    }
  }
  return null;
}

export async function getUserById(id: string): Promise<User | null> {
  return db.users.get(id) || null;
}

export async function updateUserWalletAddress(
  userId: string,
  walletAddress: string,
): Promise<boolean> {
  const user = db.users.get(userId);
  if (user) {
    user.walletAddress = walletAddress;
    db.users.set(userId, user);
    return true;
  }
  return false;
}

// Event related functions
export async function getEvents(filter?: {
  status?: string;
  category?: string;
}): Promise<Event[]> {
  let events = Array.from(db.events.values());

  if (filter?.status) {
    events = events.filter((event) => event.status === filter.status);
  }

  if (filter?.category) {
    events = events.filter((event) => event.category === filter.category);
  }

  return events;
}

export async function getEventById(id: string): Promise<Event | null> {
  return db.events.get(id) || null;
}

export async function createEvent(
  eventData: Omit<Event, "id">,
): Promise<Event> {
  const id = `event-${Date.now()}`;
  const newEvent = { id, ...eventData };
  db.events.set(id, newEvent);
  return newEvent;
}

// Consent request related functions
export async function createConsentRequest(
  eventId: string,
  studentId: string,
  verificationToken: string,
): Promise<ConsentRequest> {
  const id = `consent-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  const now = new Date();
  const expiry = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now

  const request: ConsentRequest = {
    id,
    eventId,
    studentId,
    requestDate: now.toISOString(),
    status: "pending",
    emailVerified: false,
    blockchainVerified: false,
    verificationToken,
    verificationExpiry: expiry.toISOString(),
  };

  db.consentRequests.set(id, request);
  return request;
}

export async function getConsentRequestsByStudentId(
  studentId: string,
): Promise<ConsentRequest[]> {
  return Array.from(db.consentRequests.values()).filter(
    (request) => request.studentId === studentId,
  );
}

export async function getConsentRequestById(
  id: string,
): Promise<ConsentRequest | null> {
  return db.consentRequests.get(id) || null;
}

export async function verifyEmailForConsentRequest(
  requestId: string,
): Promise<boolean> {
  const request = db.consentRequests.get(requestId);
  if (request) {
    request.emailVerified = true;
    db.consentRequests.set(requestId, request);
    return true;
  }
  return false;
}

export async function completeBlockchainVerification(
  requestId: string,
  transactionHash: string,
): Promise<boolean> {
  const request = db.consentRequests.get(requestId);
  if (request) {
    request.blockchainVerified = true;
    request.status = "approved";
    db.consentRequests.set(requestId, request);

    // Create a ticket for the approved request
    const ticketId = `ticket-${Date.now()}`;
    const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketId}`;

    const ticket: Ticket = {
      id: ticketId,
      eventId: request.eventId,
      studentId: request.studentId,
      issueDate: new Date().toISOString(),
      status: "active",
      qrCode,
      transactionHash,
    };

    db.tickets.set(ticketId, ticket);
    return true;
  }
  return false;
}

// Ticket related functions
export async function getTicketsByStudentId(
  studentId: string,
): Promise<Ticket[]> {
  return Array.from(db.tickets.values()).filter(
    (ticket) => ticket.studentId === studentId,
  );
}

export async function getTicketById(id: string): Promise<Ticket | null> {
  return db.tickets.get(id) || null;
}

export async function getTicketByEventAndStudent(
  eventId: string,
  studentId: string,
): Promise<Ticket | null> {
  for (const ticket of db.tickets.values()) {
    if (ticket.eventId === eventId && ticket.studentId === studentId) {
      return ticket;
    }
  }
  return null;
}

export async function markTicketAsUsed(ticketId: string): Promise<boolean> {
  const ticket = db.tickets.get(ticketId);
  if (ticket && ticket.status === "active") {
    ticket.status = "used";
    db.tickets.set(ticketId, ticket);
    return true;
  }
  return false;
}
