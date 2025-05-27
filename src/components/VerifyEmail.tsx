import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";
import { Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import * as api from "../lib/api";
import * as blockchain from "../lib/blockchain";

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [verificationState, setVerificationState] = useState<
    "loading" | "success" | "error" | "wallet-prompt"
  >("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const [requestId, setRequestId] = useState<string | null>(null);
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    const verifyEmailToken = async () => {
      if (!token) {
        setVerificationState("error");
        setMessage("Invalid verification link. No token provided.");
        return;
      }

      try {
        const result = await api.verifyEmail(token);

        if (result.success && result.requestId) {
          setRequestId(result.requestId);
          setVerificationState("success");
          setMessage("Email verified successfully!");

          // Check if wallet is already connected
          const account = await blockchain.getCurrentAccount();
          if (account) {
            setWalletAddress(account);
          } else {
            setVerificationState("wallet-prompt");
          }
        } else {
          setVerificationState("error");
          setMessage(result.error || "Verification failed. Please try again.");
        }
      } catch (error) {
        console.error("Error during email verification:", error);
        setVerificationState("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "An unexpected error occurred during verification.",
        );
      }
    };

    verifyEmailToken();
  }, [token]);

  const handleConnectWallet = async () => {
    setWalletConnecting(true);

    try {
      const account = await blockchain.connectWallet();

      if (account) {
        setWalletAddress(account);
        setWalletConnecting(false);

        // Proceed with blockchain verification
        if (requestId) {
          await completeVerification(account);
        }
      } else {
        setWalletConnecting(false);
        setMessage("Failed to connect wallet. Please try again.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setWalletConnecting(false);
      setMessage(
        error instanceof Error
          ? error.message
          : "An error occurred while connecting your wallet.",
      );
    }
  };

  const completeVerification = async (address: string) => {
    if (!requestId) return;

    setVerificationState("loading");
    setMessage("Processing blockchain verification...");

    try {
      const result = await api.completeBlockchainVerification(
        requestId,
        address,
      );

      if (result.success && result.ticketId) {
        setTicketId(result.ticketId);
        setVerificationState("success");
        setMessage(
          "Verification complete! Your ticket has been issued on the blockchain.",
        );
      } else {
        setVerificationState("error");
        setMessage(
          result.error || "Failed to complete blockchain verification.",
        );
      }
    } catch (error) {
      console.error("Error during blockchain verification:", error);
      setVerificationState("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during blockchain verification.",
      );
    }
  };

  const handleContinue = () => {
    navigate("/"); // Navigate to home/dashboard
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Email Verification
          </CardTitle>
          <CardDescription className="text-center">
            Verifying your email for ticket consent
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {verificationState === "loading" && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-center text-muted-foreground">{message}</p>
            </div>
          )}

          {verificationState === "success" && (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <p className="text-center font-medium mb-2">{message}</p>
              {ticketId && (
                <p className="text-center text-muted-foreground">
                  Your ticket ID: {ticketId}
                </p>
              )}
            </div>
          )}

          {verificationState === "error" && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {verificationState === "wallet-prompt" && (
            <div className="flex flex-col items-center justify-center py-6">
              <p className="text-center mb-6">
                Your email has been verified. To complete the consent process,
                please connect your MetaMask wallet.
              </p>
              <Button
                onClick={handleConnectWallet}
                className="w-full"
                disabled={walletConnecting}
              >
                {walletConnecting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 212 189"
                    className="mr-2 h-5 w-5"
                  >
                    <path
                      d="M60.75 173.25L88.313 180.563L88.313 171L90.563 168.75H106.313V180.563L132.75 173.25L126.75 160.313L132.75 149.813L112.313 48L88.313 149.813L94.5 160.313L60.75 173.25Z"
                      fill="#E2761B"
                      stroke="#E2761B"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {walletConnecting ? "Connecting..." : "Connect MetaMask Wallet"}
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter>
          {(verificationState === "success" ||
            verificationState === "error") && (
            <Button
              onClick={handleContinue}
              className="w-full"
              variant={verificationState === "error" ? "outline" : "default"}
            >
              Continue to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyEmail;
