import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { format } from "date-fns";
import { EventFormData } from "./EventForm";

interface EventPreviewProps {
  event: EventFormData;
  onPublish: () => void;
  onEdit: () => void;
  isPublishing?: boolean;
}

const EventPreview: React.FC<EventPreviewProps> = ({
  event,
  onPublish,
  onEdit,
  isPublishing = false,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Preview</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            Edit Details
          </Button>
          <Button onClick={onPublish} disabled={isPublishing}>
            {isPublishing ? "Publishing..." : "Publish Event"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div
              className="h-64 bg-cover bg-center"
              style={{
                backgroundImage: event.image
                  ? `url(${event.image})`
                  : "linear-gradient(to right, #4f46e5, #8b5cf6)",
              }}
            ></div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{event.name}</CardTitle>
                  <CardDescription className="flex items-center mt-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {event.date
                      ? format(event.date, "EEEE, MMMM d, yyyy")
                      : "Date not set"}
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    {event.time || "Time not set"}
                  </CardDescription>
                </div>
                <Badge>{event.category}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                {event.location}
              </div>

              <div className="flex items-center text-muted-foreground">
                <Users className="h-4 w-4 mr-2" />
                {event.capacity} attendees maximum
              </div>

              <div className="pt-4">
                <h3 className="font-medium mb-2">About this event</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {event.description}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Event Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">Date & Time</p>
                <p className="text-sm text-muted-foreground">
                  {event.date ? format(event.date, "PPP") : "Not set"} at{" "}
                  {event.time || "Not set"}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Location</p>
                <p className="text-sm text-muted-foreground">
                  {event.location}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Category</p>
                <p className="text-sm text-muted-foreground capitalize">
                  {event.category}
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-sm font-medium">Capacity</p>
                <p className="text-sm text-muted-foreground">
                  {event.capacity} attendees
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2">
              <p className="text-sm text-muted-foreground">
                Once published, students will be able to view this event and you
                can send ticket requests.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventPreview;
