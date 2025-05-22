import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ConsentRequestCardProps {
  eventId?: string;
  eventName?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  clubName?: string;
  status?: "pending" | "approved" | "rejected";
  onApprove?: (eventId: string) => void;
  onReject?: (eventId: string) => void;
}

const ConsentRequestCard: React.FC<ConsentRequestCardProps> = ({
  eventId = "123",
  eventName = "Annual Tech Fest",
  eventDate = "2023-12-15",
  eventTime = "14:00 - 18:00",
  eventLocation = "Main Auditorium",
  clubName = "Computer Science Club",
  status = "pending",
  onApprove = () => {},
  onReject = () => {},
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleApprove = () => {
    onApprove(eventId);
  };

  const handleReject = () => {
    onReject(eventId);
  };

  return (
    <Card className="w-[450px] bg-white shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{eventName}</CardTitle>
          <Badge
            variant={
              status === "pending"
                ? "outline"
                : status === "approved"
                  ? "default"
                  : "destructive"
            }
            className="capitalize"
          >
            {status}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-sm">
          <User size={14} />
          <span>Organized by {clubName}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-muted-foreground" />
            <span className="text-sm">{formatDate(eventDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-muted-foreground" />
            <span className="text-sm">{eventTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-muted-foreground" />
            <span className="text-sm">{eventLocation}</span>
          </div>
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="pt-4 flex justify-between">
        {status === "pending" ? (
          <>
            <Button
              variant="outline"
              onClick={handleReject}
              className="w-[48%]"
            >
              Reject
            </Button>
            <Button onClick={handleApprove} className="w-[48%]">
              Approve
            </Button>
          </>
        ) : (
          <div className="w-full text-center text-sm text-muted-foreground">
            {status === "approved"
              ? "You approved this request"
              : "You rejected this request"}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ConsentRequestCard;
