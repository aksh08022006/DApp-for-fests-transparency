import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import StudentDashboard from "./StudentDashboard";
import ClubDashboard from "./ClubDashboard";
import ClubLogin from "./ClubLogin";
import {
  Bell,
  LogOut,
  Settings,
  AlertCircle,
  Wallet,
  Mail,
  Loader2,
} from "lucide-react";

interface HomeProps {
  userRole?: "student" | "club" | undefined;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
  onLogout?: () => void;
  isAuthenticated?: boolean;
}

const Home = ({
  userRole: initialUserRole = "student",
  userName: initialUserName = "John Doe",
  userEmail: initialUserEmail = "john.doe@college.edu",
  avatarUrl,
  onLogout = () => console.log("Logout clicked"),
  isAuthenticated: initialAuthState = false,
}: HomeProps) => {
  const [notifications, setNotifications] = useState<number>(3); // Example notification count
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(initialAuthState); // Start unauthenticated
  const [userRole, setUserRole] = useState<"student" | "club">(initialUserRole);
  const [userName, setUserName] = useState<string>(initialUserName);
  const [userEmail, setUserEmail] = useState<string>(initialUserEmail);
  const [loginType, setLoginType] = useState<"student" | "club">("student");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [walletConnecting, setWalletConnecting] = useState(false);

  // Reset error when login type changes
  useEffect(() => {
    setLoginError(null);
  }, [loginType]);

  // Mock function to handle login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError(null);

    // Simulate API call
    setTimeout(() => {
      if (studentEmail && studentPassword) {
        setIsAuthenticated(true);
        setUserRole("student");
        setUserName("John Doe");
        setUserEmail(studentEmail);
        setIsLoading(false);
      } else {
        setLoginError("Please enter both email and password");
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleClubLogin = (credentials: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setLoginError(null);

    // Simulate API call
    setTimeout(() => {
      setIsAuthenticated(true);
      setUserRole("club");
      setUserName("Tech Club Admin");
      setUserEmail(credentials.email);
      setIsLoading(false);
    }, 1500);
  };

  const handleMetaMaskLogin = async () => {
    setWalletConnecting(true);
    setLoginError(null);

    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum !== "undefined") {
        // Request account access
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          // Get the connected account
          const account = accounts[0];

          // Get the network ID
          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });

          // Simulate API call to verify wallet and get user info
          setTimeout(() => {
            setIsAuthenticated(true);
            setUserRole(loginType);
            setUserName(
              loginType === "student" ? "John Doe" : "Tech Club Admin",
            );
            setUserEmail(
              loginType === "student"
                ? "john.doe@college.edu"
                : "tech.club@college.edu",
            );
            setWalletConnecting(false);
          }, 1000);
        }
      } else {
        setLoginError(
          "MetaMask not detected. Please install MetaMask extension.",
        );
        setWalletConnecting(false);
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
      setLoginError(
        error instanceof Error
          ? error.message
          : "Failed to connect to MetaMask",
      );
      setWalletConnecting(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setStudentEmail("");
    setStudentPassword("");
    onLogout();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background sticky top-0 z-10">
          <div className="container flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold">College Event Ticketing</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={loginType === "student" ? "default" : "outline"}
                onClick={() => setLoginType("student")}
              >
                Student Login
              </Button>
              <Button
                variant={loginType === "club" ? "default" : "outline"}
                onClick={() => setLoginType("club")}
              >
                Club Admin Login
              </Button>
            </div>
          </div>
        </header>

        <main className="container py-12 px-4">
          {loginType === "student" ? (
            <div className="flex min-h-[70vh] items-center justify-center">
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
                    <Button
                      onClick={handleMetaMaskLogin}
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
                      {walletConnecting
                        ? "Connecting..."
                        : "Connect with MetaMask"}
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <form onSubmit={handleLogin}>
                      <div className="grid gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="student@college.edu"
                            value={studentEmail}
                            onChange={(e) => setStudentEmail(e.target.value)}
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
                            value={studentPassword}
                            onChange={(e) => setStudentPassword(e.target.value)}
                            disabled={isLoading}
                            required
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading}
                        >
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
            </div>
          ) : (
            <ClubLogin
              onLogin={handleClubLogin}
              onMetaMaskLogin={handleMetaMaskLogin}
              isLoading={isLoading}
              loginError={loginError}
              walletConnecting={walletConnecting}
            />
          )}
        </main>

        <footer className="border-t py-4 bg-background fixed bottom-0 w-full">
          <div className="container px-4 text-center text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} College Event Ticketing DApp. All
              rights reserved.
            </p>
            <p className="mt-1">Powered by Ethereum Blockchain</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">College Event Ticketing</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src={
                    avatarUrl ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`
                  }
                  alt={userName}
                />
                <AvatarFallback>
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="hidden md:block">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
            </div>

            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>

            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 px-4">
        <Tabs defaultValue={userRole} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              {(userRole === "student" || userRole === undefined) && (
                <TabsTrigger value="student">Student Dashboard</TabsTrigger>
              )}
              {(userRole === "club" || userRole === undefined) && (
                <TabsTrigger value="club">Club Management</TabsTrigger>
              )}
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-muted px-3 py-1 rounded-full text-xs">
                <Wallet className="h-3 w-3 mr-1" />
                <span>Wallet Connected</span>
              </div>
            </div>
          </div>

          <TabsContent value="student" className="space-y-4">
            <StudentDashboard
              studentName={userName}
              studentId={studentId}
              email={userEmail}
            />
          </TabsContent>

          <TabsContent value="club" className="space-y-4">
            <ClubDashboard
              clubName={userName.replace(" Admin", "")}
              clubId={userEmail.split("@")[0]}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 bg-background">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} College Event Ticketing DApp. All
            rights reserved.
          </p>
          <p className="mt-1">Powered by Ethereum Blockchain</p>
        </div>
      </footer>
    </div>
  );
};

// Generate a random student ID for demo purposes
const studentId = `S${Math.floor(10000 + Math.random() * 90000)}`;

export default Home;
