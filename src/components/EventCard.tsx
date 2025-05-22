import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, Clock, MapPin, User } from "lucide-react";

interface EventCardProps {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  description?: string;
  image?: string;
  category?: string;
  hasTicket?: boolean;
  onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  name,
  date,
  time,
  location,
  organizer,
  description,
  image,
  category,
  hasTicket = false,
  onClick,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div
        className="h-40 bg-cover bg-center relative"
        style={{
          backgroundImage: image
            ? `url(${image})`
            : "linear-gradient(to right, #4f46e5, #8b5cf6)",
        }}
      >
        <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {time}
        </div>
        {category && (
          <div className="absolute top-4 right-4">
            <Badge className="capitalize">{category}</Badge>
          </div>
        )}
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(date)}
          </div>
          <div className="mt-1 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            {location}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground flex items-center">
          <User className="h-4 w-4 mr-1" />
          Organized by {organizer}
        </p>
        {description && (
          <p className="text-sm mt-2 line-clamp-2">{description}</p>
        )}
        {hasTicket ? (
          <Badge className="mt-2 bg-green-500">Ticket Secured</Badge>
        ) : (
          <Badge className="mt-2" variant="outline">
            No Ticket
          </Badge>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
