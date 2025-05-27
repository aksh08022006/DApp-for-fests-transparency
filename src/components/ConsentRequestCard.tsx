import React, { useState } from "react";
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
import { Calendar, Clock, MapPin, User, Check, X, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface ConsentRequestCardProps {
  id?: string;
  eventId?: string;
  eventName?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  clubName?: string;
  organizer?: string;
  requestDate?: string;
  status?: "pending" | "approved" | "rejected";
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
}

const ConsentRequestCard: React.FC<ConsentRequestCardProps> = ({
  id = "req-123",
  eventId = "123",
  eventName = "Annual Tech Fest",
  eventDate = "2023-12-15",
  eventTime = "14:00 - 18:00",
  eventLocation = "Main Auditorium",
  clubName = "Computer Science Club",
  organizer,
  requestDate,
  status = "pending",
  onApprove = () => {},
  onReject = () => {},
}) => {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const handleApprove = () => {
    setShowVerificationDialog(true);
  };

  const handleReject = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCurrentStatus("rejected");
      setIsLoading(false);
      onReject(id);
    }, 1000);
  };

  const handleSendVerification = async () => {
    setIsLoading(true);
    try {
      // Import the API module and send verification email
      const api = await import("../lib/api");
      const student = { id: "student1", email: "john.doe@college.edu" }; // In a real app, this would come from context/props

      const result = await api.sendConsentRequest(
        eventId,
        student.id,
        student.email,
        eventName,
      );

      if (result.success) {
        setVerificationSent(true);
      } else {
        throw new Error(result.error || "Failed to send verification email");
      }
    } catch (error) {
      console.error("Verification error:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationDialogClose = async () => {
    if (verificationSent) {
      try {
        // In a real app, this would be where the user signs the transaction with MetaMask
        if (typeof window.ethereum !== "undefined") {
          // Request account access if needed
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });

          if (accounts.length === 0) {
            await window.ethereum.request({ method: "eth_requestAccounts" });
          }

          // Simulate signing a message (in a real app, this would be a transaction or message signing)
          const message = `I approve the ticket request for ${eventName} on ${eventDate}`;
          const from = accounts[0];

          // This would be an actual signature in a production app
          // const signature = await window.ethereum.request({
          //   method: 'personal_sign',
          //   params: [message, from],
          // });

          // For demo purposes, we'll just simulate a successful signature
          console.log(`Message would be signed by ${from}: ${message}`);

          // Update status and call the approve function
          setCurrentStatus("approved");
          onApprove(id);
        }
      } catch (error) {
        console.error("Error during blockchain signature:", error);
        // Handle error appropriately
      }
    }
    setShowVerificationDialog(false);
    setVerificationSent(false);
  };

  return (
    <>
      <Card className="w-full bg-white shadow-md hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold">{eventName}</CardTitle>
            <Badge
              variant={
                currentStatus === "pending"
                  ? "outline"
                  : currentStatus === "approved"
                    ? "default"
                    : "destructive"
              }
              className="capitalize"
            >
              {currentStatus}
            </Badge>
          </div>
          <CardDescription className="flex items-center gap-1 text-sm">
            <User size={14} />
            <span>Organized by {organizer || clubName}</span>
          </CardDescription>
          {requestDate && (
            <p className="text-xs text-muted-foreground mt-1">
              Request received on {formatDate(requestDate)}
            </p>
          )}
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
          {currentStatus === "pending" ? (
            <>
              <Button
                variant="outline"
                onClick={handleReject}
                disabled={isLoading}
                className="w-[48%]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <X className="h-4 w-4 mr-2" />
                )}
                Reject
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isLoading}
                className="w-[48%]"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Approve
              </Button>
            </>
          ) : (
            <div className="w-full text-center text-sm text-muted-foreground flex items-center justify-center">
              {currentStatus === "approved" ? (
                <>
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                  You approved this request
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-2 text-red-500" />
                  You rejected this request
                </>
              )}
            </div>
          )}
        </CardFooter>
      </Card>

      <Dialog
        open={showVerificationDialog}
        onOpenChange={handleVerificationDialogClose}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify Your Identity</DialogTitle>
            <DialogDescription>
              To approve this ticket request, we need to verify your identity
              through email verification and blockchain signature.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {!verificationSent ? (
              <div className="space-y-4">
                <p className="text-sm">
                  We'll send a verification link to your registered email
                  address. Once verified, you'll be prompted to sign the
                  transaction with your MetaMask wallet.
                </p>
                <p className="text-sm font-medium">Event: {eventName}</p>
                <p className="text-sm font-medium">
                  Date: {formatDate(eventDate)}
                </p>
              </div>
            ) : (
              <div className="space-y-4 text-center">
                <div className="rounded-full bg-green-100 p-3 w-12 h-12 mx-auto flex items-center justify-center">
                  <Check className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium text-lg">
                  Verification Email Sent!
                </h3>
                <p className="text-sm">
                  Please check your email and follow the verification link.
                  After verification, you'll need to sign the transaction with
                  your MetaMask wallet.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            {!verificationSent ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleVerificationDialogClose}
                >
                  Cancel
                </Button>
                <Button onClick={handleSendVerification} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Send Verification Email
                </Button>
              </>
            ) : (
              <Button onClick={handleVerificationDialogClose}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ConsentRequestCard;
