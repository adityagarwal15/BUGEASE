
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  // Refs for animation elements
  const buggyRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  
  useEffect(() => {
    // Animate buggy along path
    const animateBuggy = () => {
      if (!buggyRef.current || !pathRef.current) return;
      
      const path = pathRef.current;
      const buggy = buggyRef.current;
      
      // Get path length
      const pathLength = path.getTotalLength();
      
      // Set up the animation
      let start: number | null = null;
      const duration = 8000; // 8 seconds for one loop
      
      // Animation function
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        
        // Calculate progress
        const progress = ((timestamp - start) % duration) / duration;
        
        // Get point at current progress along the path
        const point = path.getPointAtLength(pathLength * progress);
        
        // Calculate angle for rotation
        const nextPoint = path.getPointAtLength(pathLength * (progress + 0.01));
        const angle = Math.atan2(nextPoint.y - point.y, nextPoint.x - point.x) * (180 / Math.PI);
        
        // Apply transformation to the buggy
        buggy.style.transform = `translate(${point.x}px, ${point.y}px) rotate(${angle}deg)`;
        
        // Continue animation
        requestAnimationFrame(step);
      };
      
      // Start animation
      requestAnimationFrame(step);
    };
    
    // Call animation function
    animateBuggy();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#1a1a2e] text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background particle effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#7f5af0_1px,transparent_1px)] bg-[length:20px_20px] opacity-10"></div>
      
      {/* Animated SVG path and buggy */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          {/* Dotted route path */}
          <path
            ref={pathRef}
            d="M200,350 C300,250 400,550 500,450 C600,350 700,650 800,550"
            fill="none"
            stroke="#7f5af0"
            strokeWidth="2"
            strokeDasharray="10,10"
            strokeLinecap="round"
            className="opacity-30"
          />
          
          {/* Campus buildings (decorative) */}
          <rect x="250" y="200" width="100" height="100" rx="10" fill="#252542" className="opacity-20" />
          <rect x="650" y="600" width="120" height="80" rx="10" fill="#252542" className="opacity-20" />
          <rect x="400" y="500" width="80" height="80" rx="10" fill="#252542" className="opacity-20" />
          
          {/* Start and end markers */}
          <circle cx="200" cy="350" r="10" fill="#00d1ff" className="opacity-50" />
          <circle cx="800" cy="550" r="10" fill="#ff5c8a" className="opacity-50" />
        </svg>
        
        {/* Animated buggy */}
        <div 
          ref={buggyRef} 
          className="absolute top-0 left-0 w-16 h-16 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative w-full h-full">
            {/* Buggy body */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#7f5af0] to-[#00d1ff] rounded-lg rotate-45 shadow-[0_0_20px_rgba(127,90,240,0.5)]">
              <div className="absolute inset-2 bg-[#1a1a2e] rounded-sm"></div>
            </div>
            
            {/* Wheels */}
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-[#ff5c8a] rounded-full animate-spin"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-[#ff5c8a] rounded-full animate-spin"></div>
            <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#ff5c8a] rounded-full animate-spin"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#ff5c8a] rounded-full animate-spin"></div>
            
            {/* Light beam */}
            <div className="absolute top-1/2 right-0 w-32 h-6 -translate-y-1/2 bg-gradient-to-r from-[#00d1ff]/50 to-transparent rounded-r-full blur-sm transform rotate-45 opacity-50"></div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 px-4 text-center">
        <div className="glass-panel rounded-2xl p-10 border border-white/10 backdrop-blur-md max-w-3xl mx-auto">
          <div className="mb-6 mx-auto w-16 h-16 bg-gradient-to-r from-[#7f5af0] to-[#00d1ff] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(127,90,240,0.5)]">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#7f5af0] via-[#00d1ff] to-[#ff5c8a]">404</h1>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Oops! The Buggy Took a Wrong Turn</h2>
          
          <p className="text-white/70 mb-8 max-w-lg mx-auto">
            We couldn't find the page you're looking for. It seems our buggy got a bit lost on campus.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              onClick={() => window.history.back()}
              variant="outline"
              className="border-[#00d1ff]/50 text-[#00d1ff] hover:bg-[#00d1ff]/10 hover:border-[#00d1ff]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
            </Button>
            
            <Link to="/">
              <Button className="bg-gradient-to-r from-[#7f5af0] to-[#00d1ff] hover:opacity-90 border-0">
                <Home className="mr-2 h-4 w-4" /> Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Additional decorative elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0f0f1a] to-transparent"></div>
      <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-[#7f5af0]/10 blur-3xl"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-[#00d1ff]/10 blur-3xl"></div>
    </div>
  );
};

export default NotFound;
