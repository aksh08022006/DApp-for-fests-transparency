import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Calendar,
  Clock,
  Ticket,
  MapPin,
  User,
  QrCode,
  ExternalLink,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import ConsentRequestCard from "./ConsentRequestCard";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  description?: string;
  image?: string;
  category?: string;
  status: "upcoming" | "past";
}

interface Ticket {
  id: string;
  eventId: string;
  eventName: string;
  date: string;
  time?: string;
  location?: string;
  organizer: string;
  status: "active" | "used" | "expired";
  qrCode?: string;
  transactionHash?: string;
}

interface ConsentRequest {
  id: string;
  eventId: string;
  eventName: string;
  date: string;
  time: string;
  location?: string;
  organizer: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
}

interface StudentDashboardProps {
  studentName?: string;
  studentId?: string;
  email?: string;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({
  studentName = "John Doe",
  studentId = "S12345",
  email = "john.doe@college.edu",
}) => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [consentRequestsState, setConsentRequestsState] = useState<
    ConsentRequest[]
  >([]);

  // Mock data for demonstration
  const upcomingEvents: Event[] = [
    {
      id: "1",
      name: "Tech Fest 2023",
      date: "2023-12-15",
      time: "10:00 AM",
      location: "Main Auditorium",
      organizer: "Computer Science Club",
      description:
        "Annual technology festival featuring workshops, competitions, and tech talks from industry experts.",
      image:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
      category: "tech",
      status: "upcoming",
    },
    {
      id: "2",
      name: "Cultural Night",
      date: "2023-12-20",
      time: "6:00 PM",
      location: "Open Air Theatre",
      organizer: "Cultural Committee",
      description:
        "A celebration of diverse cultures through music, dance, and theatrical performances.",
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80",
      category: "cultural",
      status: "upcoming",
    },
    {
      id: "3",
      name: "Robotics Workshop",
      date: "2023-12-22",
      time: "2:00 PM",
      location: "Engineering Block",
      organizer: "Robotics Club",
      description:
        "Hands-on workshop on building and programming robots, suitable for beginners and advanced students.",
      image:
        "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
      category: "workshop",
      status: "upcoming",
    },
    {
      id: "4",
      name: "Career Fair 2023",
      date: "2023-12-28",
      time: "9:00 AM",
      location: "College Convention Center",
      organizer: "Career Development Office",
      description:
        "Connect with top employers and explore internship and job opportunities across various industries.",
      image:
        "https://images.unsplash.com/photo-1560523159-4a9692d222f9?w=800&q=80",
      category: "career",
      status: "upcoming",
    },
  ];

  const tickets: Ticket[] = [
    {
      id: "t1",
      eventId: "past1",
      eventName: "Hackathon 2023",
      date: "2023-11-10",
      time: "9:00 AM - 9:00 PM",
      location: "Computer Science Building",
      organizer: "Developer Club",
      status: "used",
      qrCode:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ticket-t1",
      transactionHash: "0x1a2b3c4d5e6f7g8h9i0j",
    },
    {
      id: "t2",
      eventId: "1",
      eventName: "Tech Fest 2023",
      date: "2023-12-15",
      time: "10:00 AM - 6:00 PM",
      location: "Main Auditorium",
      organizer: "Computer Science Club",
      status: "active",
      qrCode:
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ticket-t2",
      transactionHash: "0xabcdef1234567890abcdef",
    },
  ];

  const consentRequests: ConsentRequest[] = [
    {
      id: "cr1",
      eventId: "3",
      eventName: "Robotics Workshop",
      date: "2023-12-22",
      time: "2:00 PM",
      location: "Engineering Block",
      organizer: "Robotics Club",
      requestDate: "2023-12-01",
      status: "pending",
    },
    {
      id: "cr2",
      eventId: "2",
      eventName: "Cultural Night",
      date: "2023-12-20",
      time: "6:00 PM",
      location: "Open Air Theatre",
      organizer: "Cultural Committee",
      requestDate: "2023-12-02",
      status: "pending",
    },
  ];

  useEffect(() => {
    // Initialize consent requests
    setConsentRequestsState(consentRequests);

    // Auto-switch to consent tab if there are pending requests
    if (
      consentRequests.filter((req) => req.status === "pending").length > 0 &&
      activeTab !== "consent"
    ) {
      // Uncomment to auto-switch to consent tab when there are pending requests
      // setActiveTab("consent");
    }
  }, []);

  const handleApproveConsent = async (requestId: string) => {
    console.log(`Approved consent request: ${requestId}`);
    // Update the status of the approved request
    setConsentRequestsState((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "approved" } : req,
      ),
    );

    // Add a new ticket for the approved request
    const approvedRequest = consentRequestsState.find(
      (req) => req.id === requestId,
    );

    if (approvedRequest) {
      try {
        // Import the blockchain and API modules
        const blockchain = await import("../lib/blockchain");
        const api = await import("../lib/api");

        // Connect wallet if not already connected
        const walletAddress = await blockchain.connectWallet();

        if (walletAddress) {
          // Complete blockchain verification and issue ticket
          const result = await api.completeBlockchainVerification(
            requestId,
            walletAddress,
          );

          if (result.success && result.ticketId && result.transactionHash) {
            const newTicket: Ticket = {
              id: result.ticketId,
              eventId: approvedRequest.eventId,
              eventName: approvedRequest.eventName,
              date: approvedRequest.date,
              time: approvedRequest.time,
              location: approvedRequest.location,
              organizer: approvedRequest.organizer,
              status: "active",
              qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${result.ticketId}`,
              transactionHash: result.transactionHash,
            };

            console.log(
              "New ticket created with blockchain transaction:",
              newTicket,
            );
          } else {
            console.error(
              "Failed to complete blockchain verification:",
              result.error,
            );
          }
        } else {
          console.error("Failed to connect wallet");
          // Handle the case where wallet connection fails
        }
      } catch (error) {
        console.error("Error during ticket creation:", error);
        // Handle the error appropriately
      }
    }
  };

  const handleRejectConsent = (requestId: string) => {
    console.log(`Rejected consent request: ${requestId}`);
    // Update the status of the rejected request
    setConsentRequestsState((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: "rejected" } : req,
      ),
    );
  };

  const handleViewTicket = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowTicketDialog(true);

    // In a real app, we would verify the ticket on the blockchain here
    try {
      if (typeof window.ethereum !== "undefined") {
        // Get the current account
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          // Simulate verifying the ticket on the blockchain
          console.log(`Verifying ticket ${ticket.id} for ${accounts[0]}`);
          // This would be an actual smart contract call in a real app
        }
      }
    } catch (error) {
      console.error("Error verifying ticket on blockchain:", error);
    }
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDialog(true);
  };

  const filteredEvents = upcomingEvents.filter(
    (event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.organizer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const pendingConsentRequests = consentRequestsState.filter(
    (req) => req.status === "pending",
  );

  return (
    <div className="bg-background p-6 rounded-lg w-full max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{studentName}</h1>
          <p className="text-muted-foreground">
            {studentId} | {email}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center">
          <div className="relative mr-4">
            <Bell className="h-6 w-6 text-muted-foreground" />
            {pendingConsentRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {pendingConsentRequests.length}
              </span>
            )}
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="upcoming"
        value={activeTab}
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Upcoming Events
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center">
            <Ticket className="mr-2 h-4 w-4" />
            My Tickets
          </TabsTrigger>
          <TabsTrigger value="consent" className="flex items-center">
            <Bell className="mr-2 h-4 w-4" />
            Consent Requests
            {pendingConsentRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {pendingConsentRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            <div className="relative w-full md:w-64 mt-2 md:mt-0">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleViewEvent(event)}
                >
                  <div
                    className="h-40 bg-cover bg-center relative"
                    style={{
                      backgroundImage: event.image
                        ? `url(${event.image})`
                        : "linear-gradient(to right, #4f46e5, #8b5cf6)",
                    }}
                  >
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {event.time}
                    </div>
                    {event.category && (
                      <div className="absolute top-4 right-4">
                        <Badge className="capitalize">{event.category}</Badge>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="mt-1 flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {event.location}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      Organized by {event.organizer}
                    </p>
                    {tickets.some((ticket) => ticket.eventId === event.id) ? (
                      <Badge className="mt-2 bg-green-500">
                        Ticket Secured
                      </Badge>
                    ) : (
                      <Badge className="mt-2" variant="outline">
                        No Ticket
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No events found matching your search.
              </p>
              {searchQuery && (
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">My Tickets</h2>
          {tickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleViewTicket(ticket)}
                >
                  <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 relative flex items-center justify-center">
                    <QrCode className="h-12 w-12 text-white/80" />
                  </div>
                  <CardHeader>
                    <CardTitle>{ticket.eventName}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(ticket.date).toLocaleDateString()}
                      </div>
                      {ticket.time && (
                        <div className="mt-1 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {ticket.time}
                        </div>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Organized by {ticket.organizer}
                    </p>
                    <Badge
                      className="mt-2"
                      variant={
                        ticket.status === "active" ? "default" : "secondary"
                      }
                    >
                      {ticket.status === "active"
                        ? "Active"
                        : ticket.status === "used"
                          ? "Used"
                          : "Expired"}
                    </Badge>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      View Ticket
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                You don't have any tickets yet.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setActiveTab("upcoming")}
              >
                Browse Events
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="consent" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Consent Requests</h2>
          {consentRequestsState.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {consentRequestsState.map((request) => (
                <ConsentRequestCard
                  key={request.id}
                  id={request.id}
                  eventId={request.eventId}
                  eventName={request.eventName}
                  eventDate={request.date}
                  eventTime={request.time}
                  eventLocation={request.location}
                  organizer={request.organizer}
                  requestDate={request.requestDate}
                  status={request.status}
                  onApprove={handleApproveConsent}
                  onReject={handleRejectConsent}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                No pending consent requests.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setActiveTab("upcoming")}
              >
                Browse Events
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Ticket Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Event Ticket</DialogTitle>
            <DialogDescription>
              Present this QR code at the event entrance for verification.
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg flex items-center justify-center">
                <img
                  src={selectedTicket.qrCode}
                  alt="Ticket QR Code"
                  className="w-48 h-48"
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-lg">
                  {selectedTicket.eventName}
                </h3>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p>{new Date(selectedTicket.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time</p>
                    <p>{selectedTicket.time || "All day"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p>{selectedTicket.location || "TBA"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge className="capitalize">
                      {selectedTicket.status}
                    </Badge>
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-muted-foreground flex items-center">
                    <span>Transaction: </span>
                    <a
                      href={`https://etherscan.io/tx/${selectedTicket.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center ml-1 text-blue-600 hover:underline"
                    >
                      {selectedTicket.transactionHash?.substring(0, 10)}...
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent className="sm:max-w-3xl">
          {selectedEvent && (
            <>
              <div
                className="h-48 bg-cover bg-center -mx-6 -mt-6 mb-4 rounded-t-lg"
                style={{
                  backgroundImage: selectedEvent.image
                    ? `url(${selectedEvent.image})`
                    : "linear-gradient(to right, #4f46e5, #8b5cf6)",
                }}
              ></div>

              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{selectedEvent.name}</h2>
                  <p className="text-muted-foreground flex items-center mt-1">
                    <User className="h-4 w-4 mr-1" />
                    Organized by {selectedEvent.organizer}
                  </p>
                </div>

                {selectedEvent.category && (
                  <Badge className="capitalize">{selectedEvent.category}</Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-muted-foreground">
                      {new Date(selectedEvent.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-muted-foreground">
                      {selectedEvent.time}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">
                      {selectedEvent.location}
                    </p>
                  </div>
                </div>
              </div>

              {selectedEvent.description && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">About this event</h3>
                  <p className="text-muted-foreground">
                    {selectedEvent.description}
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                {tickets.some(
                  (ticket) => ticket.eventId === selectedEvent.id,
                ) ? (
                  <Button
                    onClick={() => {
                      const ticket = tickets.find(
                        (t) => t.eventId === selectedEvent.id,
                      );
                      if (ticket) {
                        handleViewTicket(ticket);
                      }
                      setShowEventDialog(false);
                    }}
                  >
                    View My Ticket
                  </Button>
                ) : (
                  <Button disabled>Request Ticket</Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentDashboard;
