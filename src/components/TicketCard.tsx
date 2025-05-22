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
import {
  Calendar,
  Clock,
  MapPin,
  User,
  QrCode,
  ExternalLink,
} from "lucide-react";

interface TicketCardProps {
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
  onClick?: () => void;
}

const TicketCard: React.FC<TicketCardProps> = ({
  id,
  eventId,
  eventName,
  date,
  time,
  location,
  organizer,
  status,
  qrCode,
  transactionHash,
  onClick,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="h-24 bg-gradient-to-r from-blue-500 to-purple-600 relative flex items-center justify-center">
        <QrCode className="h-12 w-12 text-white/80" />
      </div>
      <CardHeader>
        <CardTitle>{eventName}</CardTitle>
        <CardDescription>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(date)}
          </div>
          {time && (
            <div className="mt-1 flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {time}
            </div>
          )}
          {location && (
            <div className="mt-1 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {location}
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground flex items-center">
          <User className="h-4 w-4 mr-1" />
          Organized by {organizer}
        </p>
        <Badge
          className="mt-2"
          variant={status === "active" ? "default" : "secondary"}
        >
          {status === "active"
            ? "Active"
            : status === "used"
              ? "Used"
              : "Expired"}
        </Badge>

        {transactionHash && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center">
            <span>TX: </span>
            <a
              href={`https://etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center ml-1 text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              {`${transactionHash.substring(0, 8)}...${transactionHash.substring(transactionHash.length - 6)}`}
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </p>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full">
          View Ticket
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TicketCard;
