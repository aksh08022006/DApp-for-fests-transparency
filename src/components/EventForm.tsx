import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export interface EventFormData {
  id?: string;
  name: string;
  date: Date | undefined;
  time: string;
  location: string;
  description: string;
  capacity: number;
  category: string;
  image?: string;
}

interface EventFormProps {
  initialData?: Partial<EventFormData>;
  onSubmit: (data: EventFormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
}

const EventForm: React.FC<EventFormProps> = ({
  initialData = {},
  onSubmit,
  onCancel,
  submitLabel = "Create Event",
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<EventFormData>({
    name: initialData.name || "",
    date: initialData.date || undefined,
    time: initialData.time || "",
    location: initialData.location || "",
    description: initialData.description || "",
    capacity: initialData.capacity || 100,
    category: initialData.category || "general",
    image: initialData.image || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? parseInt(value) || 0 : value,
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const timeOptions = [
    "8:00 AM",
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
    "6:00 PM",
    "7:00 PM",
    "8:00 PM",
    "9:00 PM",
    "10:00 PM",
  ];

  const categoryOptions = [
    { value: "general", label: "General" },
    { value: "tech", label: "Technology" },
    { value: "cultural", label: "Cultural" },
    { value: "sports", label: "Sports" },
    { value: "academic", label: "Academic" },
    { value: "workshop", label: "Workshop" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="event-name">Event Name*</Label>
        <Input
          id="event-name"
          name="name"
          placeholder="Enter event name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event-date">Event Date*</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                id="event-date"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.date ? (
                  format(formData.date, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={formData.date}
                onSelect={handleDateChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="event-time">Event Time*</Label>
          <Select
            value={formData.time}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, time: value }))
            }
          >
            <SelectTrigger id="event-time" className="w-full">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-location">Location*</Label>
        <Input
          id="event-location"
          name="location"
          placeholder="Enter event location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event-capacity">Capacity</Label>
          <Input
            id="event-capacity"
            name="capacity"
            type="number"
            placeholder="Maximum attendees"
            value={formData.capacity}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="event-category">Category</Label>
          <Select
            value={formData.category}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger id="event-category" className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-image">Cover Image URL</Label>
        <Input
          id="event-image"
          name="image"
          placeholder="https://example.com/image.jpg"
          value={formData.image}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="event-description">Description*</Label>
        <Textarea
          id="event-description"
          name="description"
          placeholder="Describe your event"
          value={formData.description}
          onChange={handleChange}
          required
          className="min-h-[120px]"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
