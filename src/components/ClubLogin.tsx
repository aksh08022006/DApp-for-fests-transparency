import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { AlertCircle, Loader2, Mail } from "lucide-react";

interface ClubLoginProps {
  onLogin: (credentials: { email: string; password: string }) => void;
  onGoogleLogin: (googleData: any) => void;
  isLoading?: boolean;
  loginError?: string | null;
}

const ClubLogin: React.FC<ClubLoginProps> = ({
  onLogin,
  onGoogleLogin,
  isLoading = false,
  loginError = null,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [googleLoaded, setGoogleLoaded] = useState(false);

  useEffect(() => {
    // Load Google Sign-In API
    const loadGoogleSignIn = async () => {
      try {
        const auth = await import("../lib/auth");
        await auth.initGoogleAuth();
        setGoogleLoaded(true);

        // Initialize Google Sign-In button
        // @ts-ignore - Google client is loaded dynamically
        window.google.accounts.id.initialize({
          client_id: "1234567890-example.apps.googleusercontent.com", // Placeholder
          callback: handleGoogleResponse,
          auto_select: false,
        });

        // Render the button
        // @ts-ignore - Google client is loaded dynamically
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-club"),
          {
            theme: "outline",
            size: "large",
            width: "100%",
            text: "signin_with",
            shape: "rectangular",
          },
        );
      } catch (error) {
        console.error("Error loading Google Sign-In:", error);
      }
    };

    loadGoogleSignIn();

    return () => {
      // Cleanup if needed
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  const handleGoogleResponse = (response: any) => {
    if (response && response.credential) {
      onGoogleLogin(response);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Club Admin Login
          </CardTitle>
          <CardDescription className="text-center">
            Sign in to access the club management portal
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
            <div id="google-signin-club" className="w-full flex justify-center">
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="club.admin@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="space-y-2">
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
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubLogin;
