
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, LogIn, UserPlus, User, Menu, X } from 'lucide-react';
import { authService } from '@/services/authService';

const NavbarHome = () => {
  const isAuthenticated = authService.isAuthenticated();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
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
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
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
          
          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/tracking" className="text-white/80 hover:text-white transition-colors">
              Live Map
            </Link>
            <Link to="/book" className="text-white/80 hover:text-white transition-colors">
              Book Ride
            </Link>
            <Link to="/dashboard" className="text-white/80 hover:text-white transition-colors">
              Dashboard
            </Link>
            <div className="border-l border-white/20 h-6"></div>
            
            {isAuthenticated ? (
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="flex items-center gap-1 text-white hover:bg-white/10">
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="flex items-center gap-1 text-white hover:bg-white/10">
                    <LogIn className="h-4 w-4" />
                    <span>Sign in</span>
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="flex items-center gap-1 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20">
                    <UserPlus className="h-4 w-4" />
                    <span>Sign up</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center z-20">
            <button 
              className="text-white p-2"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
          
          {/* Mobile Menu Overlay */}
          <div className={`fixed inset-0 bg-[#1a1a2e]/95 backdrop-blur-lg z-10 transition-all duration-300 md:hidden ${
            mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}>
            <div className="flex flex-col items-center justify-center h-full">
              <div className="flex flex-col items-center space-y-6 py-8">
                <Link 
                  to="/tracking" 
                  className="text-white text-lg hover:text-[#7f5af0] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Live Map
                </Link>
                <Link 
                  to="/book" 
                  className="text-white text-lg hover:text-[#00d1ff] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Book Ride
                </Link>
                <Link 
                  to="/dashboard" 
                  className="text-white text-lg hover:text-[#ff5c8a] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                
                <div className="border-t border-white/10 w-24 my-4"></div>
                
                {isAuthenticated ? (
                  <Link 
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-40 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link 
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-40 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20">
                        <LogIn className="h-4 w-4 mr-2" />
                        Sign in
                      </Button>
                    </Link>
                    <Link 
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-40 bg-gradient-to-r from-[#7f5af0] to-[#00d1ff] hover:opacity-90 border-0">
                        <UserPlus className="h-4 w-4 mr-2" />
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

export default NavbarHome;
