
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Github, Linkedin, MapPin, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gradient-to-b from-[#1a1a2e]/80 to-[#0f0f1a] border-t border-white/10 pt-12 pb-6 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-[#7f5af0] via-[#00d1ff] to-[#ff5c8a] rounded-full p-1.5 shadow-[0_0_10px_rgba(127,90,240,0.5)]">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">CampusBuggy</span>
            </Link>
            <p className="text-white/70 mb-4 text-sm">
              Simplifying campus transportation with efficient buggy services. Get around campus quickly and easily.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#7f5af0] transition-colors">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#00d1ff] transition-colors">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-[#ff5c8a] transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/tracking" className="text-white/70 hover:text-[#00d1ff] transition-colors">Live Map</Link>
              </li>
              <li>
                <Link to="/book" className="text-white/70 hover:text-[#00d1ff] transition-colors">Book a Ride</Link>
              </li>
              <li>
                <Link to="/history" className="text-white/70 hover:text-[#00d1ff] transition-colors">Ride History</Link>
              </li>
              <li>
                <Link to="/alerts" className="text-white/70 hover:text-[#00d1ff] transition-colors">Alerts</Link>
              </li>
              <li>
                <Link to="/team" className="text-white/70 hover:text-[#00d1ff] transition-colors">Our Team</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-white/70 hover:text-[#00d1ff] transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/faq" className="text-white/70 hover:text-[#00d1ff] transition-colors">FAQ</Link>
              </li>
              <li>
                <Link to="/contact" className="text-white/70 hover:text-[#00d1ff] transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-white/70 hover:text-[#00d1ff] transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-white/70 hover:text-[#00d1ff] transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-[#7f5af0] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-white/70 text-sm">123 University Drive, Campus Area, CA 90210</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-[#00d1ff] mr-2 flex-shrink-0" />
                <a href="mailto:info@campusbuggy.com" className="text-white/70 hover:text-[#00d1ff] transition-colors text-sm">
                  info@campusbuggy.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-[#ff5c8a] mr-2 flex-shrink-0" />
                <a href="tel:+1-800-123-4567" className="text-white/70 hover:text-[#ff5c8a] transition-colors text-sm">
                  +1 (800) 123-4567
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-6 mt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white/50 mb-4 md:mb-0">
            &copy; {currentYear} CampusBuggy. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white/50 hover:text-white transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
