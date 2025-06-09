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
import StudentLogin from "./StudentLogin";
import {
  Bell,
  LogOut,
  Settings,
  AlertCircle,
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

// Generate a random student ID for demo purposes
const generateStudentId = () => `S${Math.floor(10000 + Math.random() * 90000)}`;

const Home = ({
  userRole: initialUserRole,
  userName: initialUserName = "John Doe",
  userEmail: initialUserEmail = "john.doe@college.edu",
  avatarUrl,
  onLogout = () => console.log("Logout clicked"),
  isAuthenticated: initialAuthState = false,
}: HomeProps) => {
  const [notifications, setNotifications] = useState<number>(3); // Example notification count
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(initialAuthState); // Start unauthenticated
  const [userRole, setUserRole] = useState<"student" | "club">(
    initialUserRole || "student",
  );
  const [userName, setUserName] = useState<string>(initialUserName);
  const [userEmail, setUserEmail] = useState<string>(initialUserEmail);
  const [loginType, setLoginType] = useState<"student" | "club">("student");
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [walletConnecting, setWalletConnecting] = useState(false);
  const [studentId, setStudentId] = useState(generateStudentId());

  // Reset error when login type changes
  useEffect(() => {
    setLoginError(null);
  }, [loginType]);

  // Handle student login with email/password
  const handleLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      // Import the API module
      const api = await import("../lib/api");

      // Call the authentication API
      const result = await api.authenticateStudent(
        credentials.email,
        credentials.password,
      );

      if (result.success && result.user) {
        setIsAuthenticated(true);
        setUserRole("student");
        setUserName(result.user.name);
        setUserEmail(result.user.email);
      } else {
        setLoginError(result.error || "Authentication failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle student login with Google
  const handleGoogleLogin = async (googleResponse: any) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      // Decode the JWT token to get user info
      const base64Url = googleResponse.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );

      const { email, name, picture } = JSON.parse(jsonPayload);

      // Verify this is a student email (could check domain, etc.)
      if (email.endsWith("@college.edu") || email.includes("student")) {
        // Generate a new student ID
        const newStudentId = generateStudentId();

        // Store user info
        localStorage.setItem("studentName", name);
        localStorage.setItem("studentId", newStudentId);
        localStorage.setItem("studentEmail", email);

        setIsAuthenticated(true);
        setUserRole("student");
        setUserName(name);
        setUserEmail(email);
        setStudentId(newStudentId);
      } else {
        setLoginError("This Google account is not registered as a student");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setLoginError(
        error instanceof Error
          ? error.message
          : "An unknown error occurred with Google login",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle club admin login with email/password
  const handleClubLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      // Import the API module
      const api = await import("../lib/api");

      // Call the authentication API
      const result = await api.authenticateClubAdmin(
        credentials.email,
        credentials.password,
      );

      if (result.success && result.user) {
        setIsAuthenticated(true);
        setUserRole("club");
        setUserName(result.user.name);
        setUserEmail(result.user.email);
      } else {
        setLoginError(result.error || "Authentication failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(
        error instanceof Error ? error.message : "An unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle club admin login with Google
  const handleGoogleClubLogin = async (googleResponse: any) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      // Decode the JWT token to get user info
      const base64Url = googleResponse.credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );

      const { email, name, picture } = JSON.parse(jsonPayload);

      // Verify this is a club admin email (could check domain, etc.)
      if (
        email.endsWith("@college.edu") ||
        email.includes("club") ||
        email.includes("admin")
      ) {
        setIsAuthenticated(true);
        setUserRole("club");
        setUserName(name);
        setUserEmail(email);
      } else {
        setLoginError("This Google account is not registered as a club admin");
      }
    } catch (error) {
      console.error("Google login error:", error);
      setLoginError(
        error instanceof Error
          ? error.message
          : "An unknown error occurred with Google login",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Removed MetaMask login function as it's no longer needed for login

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
              <StudentLogin
                onLogin={handleLogin}
                onGoogleLogin={handleGoogleLogin}
                isLoading={isLoading}
                loginError={loginError}
              />
            </div>
          ) : (
            <ClubLogin
              onLogin={handleClubLogin}
              onGoogleLogin={handleGoogleClubLogin}
              isLoading={isLoading}
              loginError={loginError}
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
              {/* Removed wallet connected indicator */}
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

export default Home;
