import React, { useState } from "react";
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
import { MetaMaskIcon } from "./ui/icons";

interface ClubLoginProps {
  onLogin: (credentials: { email: string; password: string }) => void;
  onMetaMaskLogin: () => void;
}

const ClubLogin: React.FC<ClubLoginProps> = ({ onLogin, onMetaMaskLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      onLogin({ email, password });
      setIsLoading(false);
    }, 1000);
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="club.admin@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-4 relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            onClick={onMetaMaskLogin}
            variant="outline"
            className="w-full mt-4 flex items-center justify-center"
          >
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
            Connect with MetaMask
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClubLogin;
