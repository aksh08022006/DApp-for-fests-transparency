import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import {
  CalendarIcon,
  PlusIcon,
  SearchIcon,
  UsersIcon,
  CheckIcon,
  ClipboardListIcon,
  ArrowLeft,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import EventForm, { EventFormData } from "./EventForm";
import EventPreview from "./EventPreview";

interface ClubDashboardProps {
  clubName?: string;
  clubId?: string;
}

type EventCreationStep = "list" | "create" | "preview" | "success";

const ClubDashboard = ({
  clubName = "Tech Club",
  clubId = "tech-123",
}: ClubDashboardProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  // Removed selectedStudents state
  const [eventCreationStep, setEventCreationStep] =
    useState<EventCreationStep>("list");
  const [newEvent, setNewEvent] = useState<EventFormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Removed QR scanner state from club dashboard
  const [selectedEventForScanner, setSelectedEventForScanner] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Mock data
  const [events, setEvents] = useState([
    {
      id: "1",
      name: "Hackathon 2023",
      date: new Date(2023, 10, 15),
      location: "Main Auditorium",
      attendees: 120,
      status: "upcoming",
    },
    {
      id: "2",
      name: "Web Dev Workshop",
      date: new Date(2023, 10, 5),
      location: "Lab 101",
      attendees: 45,
      status: "completed",
    },
    {
      id: "3",
      name: "AI Conference",
      date: new Date(2023, 11, 10),
      location: "Conference Hall",
      attendees: 200,
      status: "upcoming",
    },
  ]);

  const students = [
    {
      id: "s1",
      name: "Alex Johnson",
      email: "alex.j@college.edu",
      department: "Computer Science",
    },
    {
      id: "s2",
      name: "Jamie Smith",
      email: "jamie.s@college.edu",
      department: "Electrical Engineering",
    },
    {
      id: "s3",
      name: "Taylor Brown",
      email: "taylor.b@college.edu",
      department: "Computer Science",
    },
    {
      id: "s4",
      name: "Morgan Lee",
      email: "morgan.l@college.edu",
      department: "Data Science",
    },
    {
      id: "s5",
      name: "Casey Wilson",
      email: "casey.w@college.edu",
      department: "Information Technology",
    },
  ];

  const attendanceRecords = [
    {
      eventId: "2",
      studentId: "s1",
      checkInTime: "10:15 AM",
      status: "attended",
    },
    {
      eventId: "2",
      studentId: "s3",
      checkInTime: "10:05 AM",
      status: "attended",
    },
    {
      eventId: "2",
      studentId: "s4",
      checkInTime: "10:30 AM",
      status: "attended",
    },
  ];

  // Removed handleStudentSelection function

  // Removed handleSendConsentRequests function

  const handleCreateEventClick = () => {
    setEventCreationStep("create");
  };

  const handleEventFormSubmit = (data: EventFormData) => {
    setNewEvent(data);
    setEventCreationStep("preview");
  };

  const handleEventPublish = async () => {
    if (!newEvent) return;

    setIsSubmitting(true);

    try {
      // Import the API module
      const api = await import("../lib/api");

      // Create event using the API
      const result = await api.createEvent({
        name: newEvent.name,
        date:
          newEvent.date?.toISOString().split("T")[0] ||
          new Date().toISOString().split("T")[0],
        time: newEvent.time || "10:00 AM",
        location: newEvent.location || "TBD",
        description: newEvent.description || "",
        organizer: clubName,
        organizerId: clubId,
        capacity: newEvent.capacity || 100,
        category: newEvent.category || "general",
        image: newEvent.image,
        status: "upcoming",
      });

      if (result.success && result.event) {
        // Format the event for display
        const publishedEvent = {
          id: result.event.id,
          name: result.event.name,
          date: new Date(result.event.date),
          location: result.event.location,
          attendees: 0,
          status: result.event.status,
        };

        setEvents((prev) => [publishedEvent, ...prev]);
        setEventCreationStep("success");

        // Reset after showing success message
        setTimeout(() => {
          setEventCreationStep("list");
          setNewEvent(null);
        }, 3000);
      } else {
        console.error("Failed to create event:", result.error);
        alert("Failed to create event: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error publishing event:", error);
      // Handle error appropriately
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderEventContent = () => {
    switch (eventCreationStep) {
      case "create":
        return (
          <div className="space-y-6">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                className="mr-2"
                onClick={() => setEventCreationStep("list")}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back
              </Button>
              <h2 className="text-xl font-semibold">Create New Event</h2>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>
                  Fill in the information about your event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EventForm onSubmit={handleEventFormSubmit} />
              </CardContent>
            </Card>
          </div>
        );

      case "preview":
        return newEvent ? (
          <EventPreview
            event={newEvent}
            onPublish={handleEventPublish}
            onEdit={() => setEventCreationStep("create")}
            isPublishing={isSubmitting}
          />
        ) : null;

      case "success":
        return (
          <Card className="border-green-500">
            <CardHeader>
              <CardTitle className="text-green-600 flex items-center">
                <CheckIcon className="mr-2 h-5 w-5" /> Event Published
                Successfully
              </CardTitle>
              <CardDescription>
                Your event has been published and is now visible to students
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                You can now send ticket requests to students for this event.
              </p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => setEventCreationStep("list")}>
                Return to Events
              </Button>
            </CardFooter>
          </Card>
        );

      case "list":
      default:
        return (
          <>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Your Events</h2>
              <Button onClick={handleCreateEventClick}>
                <PlusIcon className="mr-2 h-4 w-4" /> Create Event
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardHeader>
                    <CardTitle>{event.name}</CardTitle>
                    <CardDescription>
                      {format(event.date, "PPP")} • {event.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <UsersIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{event.attendees} attendees</span>
                      </div>
                      <Badge
                        variant={
                          event.status === "upcoming" ? "default" : "secondary"
                        }
                      >
                        {event.status === "upcoming" ? "Upcoming" : "Completed"}
                      </Badge>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="w-full">
                      Manage Event
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <div className="bg-background p-6 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          {clubName} Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage your events, ticket requests, and attendance
        </p>
      </div>

      <Tabs defaultValue="events" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
        </TabsList>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          {renderEventContent()}
        </TabsContent>

        {/* Removed Ticket Requests Tab */}

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Attendance Tracking</h2>
            <div className="flex gap-2">
              <select className="border rounded-md px-3 py-2 bg-background">
                <option value="">All Events</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>
              <Button variant="outline">
                <ClipboardListIcon className="mr-2 h-4 w-4" /> Export Report
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Web Dev Workshop</CardTitle>
              <CardDescription>
                {format(events[1].date, "PPP")} • {events[1].location}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Check-in Time</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceRecords.map((record) => {
                    const student = students.find(
                      (s) => s.id === record.studentId,
                    );
                    return (
                      <TableRow key={`${record.eventId}-${record.studentId}`}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student?.id}`}
                              />
                              <AvatarFallback>
                                {student?.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {student?.name}
                          </div>
                        </TableCell>
                        <TableCell>{student?.email}</TableCell>
                        <TableCell>{record.checkInTime}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            <CheckIcon className="h-3 w-3 mr-1" />{" "}
                            {record.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                Total Attendance: {attendanceRecords.length}/{students.length}{" "}
                students
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
      {/* Removed QR Scanner Dialog */}
    </div>
  );
};

export default ClubDashboard;
