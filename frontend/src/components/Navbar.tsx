import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Menu,
  MapPin,
  CalendarClock,
  User,
  LogOut,
  ChevronDown,
  ShieldCheck,
  Bell,
  Info,
  Image,
  History,
  Settings,
  MessageSquare,
  FileText,
  Lock,
  HelpCircle,
  Home,
  Car,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { authService, UserProfile } from "@/services/authService";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDriver, setIsDriver] = useState(false);

  useEffect(() => {
    setIsDriver(authService.isDriver());

    // Fetch user profile for authenticated users
    const fetchUserProfile = async () => {
      if (authService.isAuthenticated()) {
        try {
          const profile = await authService.getProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [location]);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    // Clear authentication state
    authService.logout();

    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });

    navigate("/login");
  };

  const isAuthenticated = authService.isAuthenticated();

  return (
    <nav className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-full p-1.5">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-glow">CampusBuggy</span>
            </Link>
            {isAuthenticated && isDriver && (
              <Badge variant="success" className="ml-2">
                Driver
              </Badge>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated && (
              <>
                {isDriver ? (
                  // Driver Navigation
                  <>
                    <Link to="/driver/dashboard">
                      <Button
                        variant={
                          isActive("/driver/dashboard") ? "secondary" : "ghost"
                        }
                        className="flex items-center space-x-2"
                      >
                        <span>Dashboard</span>
                      </Button>
                    </Link>
                    <Link to="/tracking">
                      <Button
                        variant={isActive("/tracking") ? "secondary" : "ghost"}
                        className="flex items-center space-x-2"
                      >
                        <span>Live Map</span>
                      </Button>
                    </Link>
                    <Link to="/driver/faq">
                      <Button
                        variant={
                          isActive("/driver/faq") ? "secondary" : "ghost"
                        }
                        className="flex items-center space-x-2"
                      >
                        <span>FAQ</span>
                      </Button>
                    </Link>
                  </>
                ) : (
                  // Student Navigation
                  <>
                    <Link to="/dashboard">
                      <Button
                        variant={isActive("/dashboard") ? "secondary" : "ghost"}
                        className="flex items-center space-x-2"
                      >
                        <span>Dashboard</span>
                      </Button>
                    </Link>
                    <Link to="/tracking">
                      <Button
                        variant={isActive("/tracking") ? "secondary" : "ghost"}
                        className="flex items-center space-x-2"
                      >
                        <span>Live Map</span>
                      </Button>
                    </Link>
                    <Link to="/book">
                      <Button
                        variant={isActive("/book") ? "secondary" : "ghost"}
                        className="flex items-center space-x-2"
                      >
                        <span>Book Ride</span>
                      </Button>
                    </Link>
                    <Link to="/history">
                      <Button
                        variant={isActive("/history") ? "secondary" : "ghost"}
                        className="flex items-center space-x-2"
                      >
                        <span>History</span>
                      </Button>
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Enhanced User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative ml-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {isDriver ? "DR" : "ST"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background"></div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {isDriver ? "Driver Account" : "Student Account"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {loading
                          ? "Loading..."
                          : userProfile?.email || "No email available"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(isDriver ? "/driver/profile" : "/profile")
                      }
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(isDriver ? "/driver/dashboard" : "/dashboard")
                      }
                    >
                      <Home className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        navigate(
                          isDriver ? "/driver/notifications" : "/notifications"
                        )
                      }
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </DropdownMenuItem>
                    {!isDriver && (
                      <DropdownMenuItem onClick={() => navigate("/history")}>
                        <History className="mr-2 h-4 w-4" />
                        <span>Ride History</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />

                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <Info className="mr-2 h-4 w-4" />
                        <span>Resources</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="w-48">
                        <DropdownMenuItem onClick={() => navigate("/about")}>
                          <Info className="mr-2 h-4 w-4" />
                          <span>About</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate(isDriver ? "/driver/faq" : "/faq")
                          }
                        >
                          <HelpCircle className="mr-2 h-4 w-4" />
                          <span>FAQ</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/contact")}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Contact Us</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/gallery")}>
                          <Image className="mr-2 h-4 w-4" />
                          <span>Gallery</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Legal</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="w-48">
                        <DropdownMenuItem onClick={() => navigate("/privacy")}>
                          <Lock className="mr-2 h-4 w-4" />
                          <span>Privacy Policy</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/terms")}>
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Terms of Service</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>

                    <DropdownMenuItem onClick={() => navigate("/admin-auth")}>
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Admin Access</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden rounded-md p-2 inline-flex items-center justify-center text-foreground hover:bg-muted"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-card border-b border-border animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {isAuthenticated && (
              <>
                {isDriver ? (
                  // Driver Navigation - Mobile
                  <>
                    <Link
                      to="/driver/dashboard"
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium",
                        isActive("/driver/dashboard")
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/tracking"
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium",
                        isActive("/tracking")
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      Live Map
                    </Link>
                    <Link
                      to="/driver/profile"
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium",
                        isActive("/driver/profile")
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/driver/faq"
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium",
                        isActive("/driver/faq")
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      FAQ
                    </Link>
                    <Link
                      to="/driver/notifications"
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium",
                        isActive("/driver/notifications")
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      Notifications
                    </Link>
                  </>
                ) : (
                  // Student Navigation - Mobile
                  <>
                    <Link
                      to="/dashboard"
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium",
                        isActive("/dashboard")
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/tracking"
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium",
                        isActive("/tracking")
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      Live Map
                    </Link>
                    <Link
                      to="/book"
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium",
                        isActive("/book")
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      Book Ride
                    </Link>
                    <Link
                      to="/history"
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium",
                        isActive("/history")
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      History
                    </Link>
                    <Link
                      to="/profile"
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium",
                        isActive("/profile")
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/notifications"
                      className={cn(
                        "block px-3 py-2 rounded-md text-base font-medium",
                        isActive("/notifications")
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      Notifications
                    </Link>
                  </>
                )}
              </>
            )}

            {/* Common links */}
            <Link
              to="/about"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive("/about")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={cn(
                "block px-3 py-2 rounded-md text-base font-medium",
                isActive("/contact")
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-muted"
              )}
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>

            {isAuthenticated ? (
              <button
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-muted"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
              >
                Log out
              </button>
            ) : (
              <div className="flex flex-col space-y-1 mt-4 px-3">
                <Link
                  to="/login"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link
                  to="/signup"
                  className="w-full"
                  onClick={() => setIsOpen(false)}
                >
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
