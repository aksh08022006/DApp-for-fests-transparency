import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, Loader2, Mail } from "lucide-react";
import { Separator } from "./ui/separator";

interface StudentLoginProps {
  onLogin: (credentials: { email: string; password: string }) => void;
  onGoogleLogin: (googleData: any) => void;
  isLoading?: boolean;
  loginError?: string | null;
}

const StudentLogin: React.FC<StudentLoginProps> = ({
  onLogin,
  onGoogleLogin,
  isLoading = false,
  loginError = null,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // Fix for removeChild error
  useEffect(() => {
    let isMounted = true;

    // Create a ref to store the button container
    const buttonContainerRef = { current: null as HTMLElement | null };

    // Load Google Sign-In API
    const loadGoogleSignIn = async () => {
      try {
        const auth = await import("../lib/auth");
        await auth.initGoogleAuth();

        // Check if component is still mounted before updating state
        if (!isMounted) return;

        setGoogleLoaded(true);

        // Initialize Google Sign-In button
        if (
          typeof window !== "undefined" &&
          window.google &&
          window.google.accounts
        ) {
          // @ts-ignore - Google client is loaded dynamically
          window.google.accounts.id.initialize({
            client_id:
              "348859740860-bckqbgtpc6mceqe049q0joqu65a4e6g6.apps.googleusercontent.com",
            callback: handleGoogleResponse,
            auto_select: false,
          });

          // Wait for next render cycle to ensure DOM is stable
          setTimeout(() => {
            if (!isMounted) return;

            // Get a fresh reference to the container
            const buttonContainer = document.getElementById(
              "google-signin-student",
            );
            if (!buttonContainer) return;

            // Store the reference
            buttonContainerRef.current = buttonContainer;

            // Create a new div for the button
            const buttonElement = document.createElement("div");
            buttonElement.id = "google-button-student";
            buttonContainer.appendChild(buttonElement);

            // @ts-ignore - Google client is loaded dynamically
            window.google.accounts.id.renderButton(buttonElement, {
              theme: "outline",
              size: "large",
              width: "100%",
              text: "signin_with",
              shape: "rectangular",
            });
          }, 0);
        }
      } catch (error) {
        console.error("Error loading Google Sign-In:", error);
      }
    };

    loadGoogleSignIn();

    return () => {
      // Mark component as unmounted
      isMounted = false;

      // Cleanup Google Sign-In when component unmounts
      try {
        // First cancel the Google Sign-In
        if (
          typeof window !== "undefined" &&
          window.google &&
          window.google.accounts &&
          window.google.accounts.id
        ) {
          // @ts-ignore - Google client is loaded dynamically
          window.google.accounts.id.cancel();
        }

        // Then safely remove the button element if it exists
        if (buttonContainerRef.current) {
          const buttonElement = document.getElementById(
            "google-button-student",
          );
          if (buttonElement) {
            // Check if the element is still in the DOM and has a parent
            if (buttonElement.parentNode) {
              buttonElement.parentNode.removeChild(buttonElement);
            }
          }
        }
      } catch (error) {
        console.error("Error cleaning up Google Sign-In:", error);
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  const handleGoogleResponse = (response: any) => {
    if (response && response.credential) {
      // Process the response and redirect to student dashboard
      onGoogleLogin(response);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Student Login
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to access the student ticketing platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loginError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{loginError}</AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-4">
          {/* Google Sign-In Button */}
          <div
            id="google-signin-student"
            className="w-full flex justify-center"
          >
            {!googleLoaded && (
              <div className="h-10 bg-muted animate-pulse rounded-md w-full"></div>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Mail className="mr-2 h-4 w-4" />
                    Sign in with Email
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <p className="mt-2 text-xs text-center text-muted-foreground">
          By signing in, you agree to our{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </a>
          .
        </p>
      </CardFooter>
    </Card>
  );
};

export default StudentLogin;
