
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, LogIn, UserPlus } from 'lucide-react';

const NavbarHome = () => {
  return (
    <div className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-40 w-full">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-full p-1.5">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-glow">CampusBuggy</span>
          </Link>
          
          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/tracking" className="text-foreground hover:text-primary transition-colors">
              Live Map
            </Link>
            <Link to="/book" className="text-foreground hover:text-primary transition-colors">
              Book Ride
            </Link>
            <Link to="/dashboard" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </Link>
            <div className="border-l border-border/60 h-6"></div>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="flex items-center gap-1">
                <LogIn className="h-4 w-4" />
                <span>Sign in</span>
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" />
                <span>Sign up</span>
              </Button>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="mr-2">
                Sign in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavbarHome;
