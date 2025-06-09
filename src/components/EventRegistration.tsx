import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { QrCode, Mail, Loader2, Check } from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";

interface EventRegistrationProps {
  eventId: string;
  eventName: string;
  isOpen: boolean;
  onClose: () => void;
  onRegister: (email: string) => Promise<boolean>;
  onMetaMaskRegister?: () => Promise<boolean>;
}

const EventRegistration: React.FC<EventRegistrationProps> = ({
  eventId,
  eventName,
  isOpen,
  onClose,
  onRegister,
  onMetaMaskRegister,
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registrationMethod, setRegistrationMethod] = useState<
    "email" | "metamask"
  >("email");
  const [isMetaMaskLoading, setIsMetaMaskLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const success = await onRegister(email);
      if (success) {
        setIsSuccess(true);
      } else {
        setError("Failed to register for the event. Please try again.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetaMaskRegister = async () => {
    if (!onMetaMaskRegister) return;

    setIsMetaMaskLoading(true);
    setError(null);

    try {
      const success = await onMetaMaskRegister();
      if (success) {
        setIsSuccess(true);
        setRegistrationMethod("metamask");
      } else {
        setError("Failed to register with MetaMask. Please try again.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setIsMetaMaskLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading && !isMetaMaskLoading) {
      setEmail("");
      setIsSuccess(false);
      setError(null);
      setRegistrationMethod("email");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Register for {eventName}</DialogTitle>
          <DialogDescription>
            {!isSuccess
              ? "Choose your registration method below."
              : registrationMethod === "email"
                ? "Registration successful! Check your email for confirmation."
                : "Ticket purchased successfully via MetaMask! Your ticket has been issued on the blockchain."}
          </DialogDescription>
        </DialogHeader>

        {!isSuccess ? (
          <div className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Registration Method Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email Registration */}
              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold">Email Registration</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Register with your email and receive a confirmation link.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    required
                    disabled={isLoading || isMetaMaskLoading}
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || isMetaMaskLoading}
                    className="w-full"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Registering...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        Register via Email
                      </>
                    )}
                  </Button>
                </form>
              </div>

              {/* MetaMask Registration */}
              {onMetaMaskRegister && (
                <div className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center space-x-2">
                    <QrCode className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold">MetaMask Ticket</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Purchase your ticket directly with MetaMask and get instant
                    blockchain verification.
                  </p>

                  <Button
                    onClick={handleMetaMaskRegister}
                    disabled={isLoading || isMetaMaskLoading}
                    className="w-full bg-orange-600 hover:bg-orange-700"
                  >
                    {isMetaMaskLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <QrCode className="mr-2 h-4 w-4" />
                        Buy Ticket with MetaMask
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading || isMetaMaskLoading}
              >
                Cancel
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <div className="py-6 flex flex-col items-center justify-center">
            <div className="rounded-full bg-green-100 p-3 w-16 h-16 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-center mb-6">
              {registrationMethod === "email" ? (
                <>
                  We've sent a confirmation email to <strong>{email}</strong>.
                  Please check your inbox and follow the instructions to
                  complete your registration.
                </>
              ) : (
                <>
                  Your ticket has been successfully purchased and issued on the
                  blockchain! You can view your ticket in the "My Tickets"
                  section of your dashboard.
                </>
              )}
            </p>
            <Button onClick={handleClose}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EventRegistration;
