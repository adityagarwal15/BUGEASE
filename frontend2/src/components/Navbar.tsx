
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
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
  X
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { authService, UserProfile } from '@/services/authService';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDriver, setIsDriver] = useState(false);
  
  // Track scroll position for navbar transparency effect
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    setIsDriver(authService.isDriver());

    // Fetch user profile for authenticated users
    const fetchUserProfile = async () => {
      if (authService.isAuthenticated()) {
        try {
          const profile = await authService.getProfile();
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
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
    <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-[#1a1a2e]/90 backdrop-blur-md shadow-md' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 z-20">
            <div className="bg-gradient-to-r from-[#7f5af0] via-[#00d1ff] to-[#ff5c8a] rounded-full p-1.5 shadow-[0_0_10px_rgba(127,90,240,0.5)]">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-white">CampusBuggy</span>
          </Link>
          
          {isAuthenticated && isDriver && (
            <Badge className="ml-2 bg-gradient-to-r from-[#7f5af0] to-[#00d1ff] text-white">Driver</Badge>
          )}
          
          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated && (
              <>
                {isDriver ? (
                  // Driver Navigation
                  <>
                    <Link to="/driver/dashboard" className="text-white/80 hover:text-white transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/tracking" className="text-white/80 hover:text-white transition-colors">
                      Live Map
                    </Link>
                    <Link to="/driver/faq" className="text-white/80 hover:text-white transition-colors">
                      FAQ
                    </Link>
                  </>
                ) : (
                  // Student Navigation
                  <>
                    <Link to="/dashboard" className="text-white/80 hover:text-white transition-colors">
                      Dashboard
                    </Link>
                    <Link to="/tracking" className="text-white/80 hover:text-white transition-colors">
                      Live Map
                    </Link>
                    <Link to="/book" className="text-white/80 hover:text-white transition-colors">
                      Book Ride
                    </Link>
                    <Link to="/history" className="text-white/80 hover:text-white transition-colors">
                      History
                    </Link>
                  </>
                )}
              </>
            )}
            
            <div className="border-l border-white/20 h-6"></div>
            
            {/* Enhanced User Menu */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative ml-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-r from-[#7f5af0] to-[#00d1ff] text-white">
                        {isDriver ? "DR" : "ST"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background"></div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-[#1a1a2e]/90 backdrop-blur-md border border-white/10">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none text-white">
                        {isDriver ? "Driver Account" : "Student Account"}
                      </p>
                      <p className="text-xs leading-none text-white/60">
                        {loading ? "Loading..." : userProfile?.email || "No email available"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-white/10" />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate(isDriver ? "/driver/profile" : "/profile")} className="text-white/80 hover:text-white hover:bg-white/10">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(isDriver ? "/driver/dashboard" : "/dashboard")} className="text-white/80 hover:text-white hover:bg-white/10">
                      <Home className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(isDriver ? "/driver/notifications" : "/notifications")} className="text-white/80 hover:text-white hover:bg-white/10">
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </DropdownMenuItem>
                    {!isDriver && (
                      <DropdownMenuItem onClick={() => navigate("/history")} className="text-white/80 hover:text-white hover:bg-white/10">
                        <History className="mr-2 h-4 w-4" />
                        <span>Ride History</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator className="bg-white/10" />
                  
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-white/80 hover:text-white hover:bg-white/10">
                        <Info className="mr-2 h-4 w-4" />
                        <span>Resources</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="w-48 bg-[#1a1a2e]/90 backdrop-blur-md border border-white/10">
                        <DropdownMenuItem onClick={() => navigate("/about")} className="text-white/80 hover:text-white hover:bg-white/10">
                          <Info className="mr-2 h-4 w-4" />
                          <span>About</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(isDriver ? "/driver/faq" : "/faq")} className="text-white/80 hover:text-white hover:bg-white/10">
                          <HelpCircle className="mr-2 h-4 w-4" />
                          <span>FAQ</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/contact")} className="text-white/80 hover:text-white hover:bg-white/10">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Contact Us</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/gallery")} className="text-white/80 hover:text-white hover:bg-white/10">
                          <Image className="mr-2 h-4 w-4" />
                          <span>Gallery</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="text-white/80 hover:text-white hover:bg-white/10">
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Legal</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="w-48 bg-[#1a1a2e]/90 backdrop-blur-md border border-white/10">
                        <DropdownMenuItem onClick={() => navigate("/privacy")} className="text-white/80 hover:text-white hover:bg-white/10">
                          <Lock className="mr-2 h-4 w-4" />
                          <span>Privacy Policy</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate("/terms")} className="text-white/80 hover:text-white hover:bg-white/10">
                          <FileText className="mr-2 h-4 w-4" />
                          <span>Terms of Service</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    
                    <DropdownMenuItem onClick={() => navigate("/admin-auth")} className="text-white/80 hover:text-white hover:bg-white/10">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      <span>Admin Access</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  
                  <DropdownMenuSeparator className="bg-white/10" />
                  <DropdownMenuItem onClick={handleLogout} className="text-white/80 hover:text-red-400 hover:bg-white/10">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 text-white hover:bg-white/10">
                    <User className="h-4 w-4" />
                    <span>Sign in</span>
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="flex items-center gap-1 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20">
                    <User className="h-4 w-4" />
                    <span>Sign up</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center z-20">
            <button 
              className="text-white p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
          
          {/* Mobile Menu Overlay */}
          <div className={`fixed inset-0 bg-[#1a1a2e]/95 backdrop-blur-lg z-10 transition-all duration-300 md:hidden ${
            isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="flex flex-col items-center space-y-6 py-8">
                {isAuthenticated && (
                  <>
                    {isDriver ? (
                      // Driver Navigation - Mobile
                      <>
                        <Link 
                          to="/driver/dashboard" 
                          className="text-white text-lg hover:text-[#7f5af0] transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link 
                          to="/tracking" 
                          className="text-white text-lg hover:text-[#00d1ff] transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Live Map
                        </Link>
                        <Link 
                          to="/driver/profile" 
                          className="text-white text-lg hover:text-[#ff5c8a] transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link 
                          to="/driver/faq" 
                          className="text-white text-lg hover:text-[#7f5af0] transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          FAQ
                        </Link>
                        <Link 
                          to="/driver/notifications" 
                          className="text-white text-lg hover:text-[#00d1ff] transition-colors"
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
                          className="text-white text-lg hover:text-[#7f5af0] transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link 
                          to="/tracking" 
                          className="text-white text-lg hover:text-[#00d1ff] transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Live Map
                        </Link>
                        <Link 
                          to="/book" 
                          className="text-white text-lg hover:text-[#ff5c8a] transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Book Ride
                        </Link>
                        <Link 
                          to="/history" 
                          className="text-white text-lg hover:text-[#7f5af0] transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          History
                        </Link>
                        <Link 
                          to="/profile" 
                          className="text-white text-lg hover:text-[#00d1ff] transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link 
                          to="/notifications" 
                          className="text-white text-lg hover:text-[#ff5c8a] transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          Notifications
                        </Link>
                      </>
                    )}
                    
                    <div className="border-t border-white/10 w-24 my-4"></div>
                  </>
                )}
                
                {/* Common links */}
                <Link 
                  to="/about" 
                  className="text-white text-lg hover:text-[#7f5af0] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className="text-white text-lg hover:text-[#00d1ff] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Contact
                </Link>
                
                {isAuthenticated ? (
                  <Button
                    className="w-40 bg-gradient-to-r from-[#ff5c8a] to-[#ff5c8a]/70 hover:opacity-90 border-0 mt-4"
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </Button>
                ) : (
                  <>
                    <Link 
                      to="/login"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button className="w-40 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 mt-4">
                        <User className="h-4 w-4 mr-2" />
                        Sign in
                      </Button>
                    </Link>
                    <Link 
                      to="/signup"
                      onClick={() => setIsOpen(false)}
                    >
                      <Button className="w-40 bg-gradient-to-r from-[#7f5af0] to-[#00d1ff] hover:opacity-90 border-0">
                        <User className="h-4 w-4 mr-2" />
                        Sign up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
