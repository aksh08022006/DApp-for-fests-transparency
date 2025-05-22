import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Clock, Ticket } from "lucide-react";
import ConsentRequestCard from "./ConsentRequestCard";

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  status: "upcoming" | "past";
}

interface Ticket {
  id: string;
  eventId: string;
  eventName: string;
  date: string;
  organizer: string;
  status: "active" | "used" | "expired";
}

interface ConsentRequest {
  id: string;
  eventId: string;
  eventName: string;
  date: string;
  time: string;
  organizer: string;
  requestDate: string;
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

  // Mock data for demonstration
  const upcomingEvents: Event[] = [
    {
      id: "1",
      name: "Tech Fest 2023",
      date: "2023-12-15",
      time: "10:00 AM",
      location: "Main Auditorium",
      organizer: "Computer Science Club",
      status: "upcoming",
    },
    {
      id: "2",
      name: "Cultural Night",
      date: "2023-12-20",
      time: "6:00 PM",
      location: "Open Air Theatre",
      organizer: "Cultural Committee",
      status: "upcoming",
    },
    {
      id: "3",
      name: "Robotics Workshop",
      date: "2023-12-22",
      time: "2:00 PM",
      location: "Engineering Block",
      organizer: "Robotics Club",
      status: "upcoming",
    },
  ];

  const tickets: Ticket[] = [
    {
      id: "t1",
      eventId: "past1",
      eventName: "Hackathon 2023",
      date: "2023-11-10",
      organizer: "Developer Club",
      status: "used",
    },
    {
      id: "t2",
      eventId: "1",
      eventName: "Tech Fest 2023",
      date: "2023-12-15",
      organizer: "Computer Science Club",
      status: "active",
    },
  ];

  const consentRequests: ConsentRequest[] = [
    {
      id: "cr1",
      eventId: "3",
      eventName: "Robotics Workshop",
      date: "2023-12-22",
      time: "2:00 PM",
      organizer: "Robotics Club",
      requestDate: "2023-12-01",
    },
    {
      id: "cr2",
      eventId: "2",
      eventName: "Cultural Night",
      date: "2023-12-20",
      time: "6:00 PM",
      organizer: "Cultural Committee",
      requestDate: "2023-12-02",
    },
  ];

  const handleApproveConsent = (requestId: string) => {
    console.log(`Approved consent request: ${requestId}`);
    // Here you would trigger the email verification flow
    // and MetaMask integration
  };

  const handleRejectConsent = (requestId: string) => {
    console.log(`Rejected consent request: ${requestId}`);
    // Here you would handle the rejection logic
  };

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
            {consentRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {consentRequests.length}
              </span>
            )}
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="upcoming"
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
            {consentRequests.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {consentRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="overflow-hidden">
                  <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 relative">
                    <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {event.time}
                    </div>
                  </div>
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="mt-1">{event.location}</div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
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
            <p className="text-muted-foreground">No upcoming events found.</p>
          )}
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">My Tickets</h2>
          {tickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardHeader>
                    <CardTitle>{ticket.eventName}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(ticket.date).toLocaleDateString()}
                      </div>
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
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              You don't have any tickets yet.
            </p>
          )}
        </TabsContent>

        <TabsContent value="consent" className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Consent Requests</h2>
          {consentRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {consentRequests.map((request) => (
                <ConsentRequestCard
                  key={request.id}
                  id={request.id}
                  eventName={request.eventName}
                  date={request.date}
                  time={request.time}
                  organizer={request.organizer}
                  requestDate={request.requestDate}
                  onApprove={() => handleApproveConsent(request.id)}
                  onReject={() => handleRejectConsent(request.id)}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No pending consent requests.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StudentDashboard;
