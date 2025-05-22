
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NavbarHome from '@/components/NavbarHome';
import { CompassIcon, MapPin, Calendar, Clock, Users, ArrowRight, CheckCircle, Map, Smartphone, Sparkles, User } from 'lucide-react';

const Index = () => {
  // Refs for animation targets
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
  // Animation setup on component mount
  useEffect(() => {
    // Simple animation for stats counters
    const animateValue = (obj: HTMLElement, start: number, end: number, duration: number) => {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        obj.innerHTML = value.toString();
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };

    // Animate stats when they come into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counters = entry.target.querySelectorAll('.counter');
          counters.forEach(counter => {
            const target = counter as HTMLElement;
            const endValue = parseInt(target.getAttribute('data-count') || '0', 10);
            animateValue(target, 0, endValue, 2000);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    // Clean up
    return () => {
      if (statsRef.current) observer.unobserve(statsRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#1a1a2e] text-white overflow-hidden">
      <NavbarHome />
      
      {/* Hero Section - Cinematic and actionable */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden py-20"
      >
        {/* Background ambient effects */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')] bg-cover opacity-10"></div>
        
        {/* Animated background overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a1a2e]/80 to-[#1a1a2e]"></div>
        
        {/* Particle overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#7f5af0_1px,transparent_1px)] bg-[length:20px_20px] opacity-20"></div>
        
        <div className="container relative mx-auto px-4 z-10 animate-fade-in">
          <div className="max-w-3xl mx-auto text-center">            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#7f5af0] via-[#00d1ff] to-[#ff5c8a]">
                Smarter Mobility,
              </span>
              <span className="block">Right on Campus</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-xl mx-auto leading-relaxed">
              Track your buggy live. Request rides. Move effortlessly across campus with our intelligent transportation network.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Link to="/book">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-[#7f5af0] to-[#7f5af0]/80 hover:from-[#7f5af0]/90 hover:to-[#7f5af0]/70 hover:scale-105 transition-all duration-300 shadow-[0_0_15px_rgba(127,90,240,0.5)] text-white border-0"
                >
                  Request a Ride <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/tracking">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-[#00d1ff]/50 text-[#00d1ff] hover:bg-[#00d1ff]/10 hover:border-[#00d1ff] hover:scale-105 transition-all duration-300"
                >
                  <CompassIcon className="mr-2 h-5 w-5" /> Live Tracker
                </Button>
              </Link>
            </div>
            
            {/* Floating badges */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm">
              <span className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center animate-pulse-slow">
                <CheckCircle className="h-4 w-4 mr-2 text-[#00d1ff]" /> Real-time Tracking
              </span>
              <span className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-[#ff5c8a]" /> Electric Fleet
              </span>
              <span className="px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center animate-pulse-slow">
                <CheckCircle className="h-4 w-4 mr-2 text-[#7f5af0]" /> Campus Coverage
              </span>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce-soft">
          <span className="text-white/50 text-sm mb-2">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center">
            <div className="w-1.5 h-3 bg-white/50 rounded-full mt-2 animate-pulse-slow"></div>
          </div>
        </div>
      </section>
      
      {/* Map Preview Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e]/50 via-transparent to-[#1a1a2e]/50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              Live Campus Coverage
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              See where buggies are in real-time and book the one closest to you.
            </p>
          </div>
          
          <div className="glass-panel rounded-2xl overflow-hidden relative max-w-5xl mx-auto shadow-[0_0_30px_rgba(0,209,255,0.1)]">
            <div className="aspect-w-16 aspect-h-9 w-full">
              <div className="w-full h-full bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=40.7128,-74.0060&zoom=14&size=1200x600&style=element:geometry%7Ccolor:0x1a1a2e&style=element:labels.text%7Cvisibility:off&style=feature:administrative%7Celement:geometry%7Cvisibility:off&style=feature:poi%7Cvisibility:off&style=feature:road%7Celement:geometry%7Ccolor:0x7f5af0&style=feature:transit%7Cvisibility:off&style=feature:water%7Celement:geometry%7Ccolor:0x00d1ff&key=AIzaSyCvpLcAoYsmush67jtucnbw_hwoz3Csvpo')] bg-cover bg-center relative">
                {/* Animated pulsing buggy markers */}
                <div className="absolute h-6 w-6 top-1/4 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="absolute inset-0 bg-[#7f5af0] rounded-full animate-ping opacity-75"></div>
                  <div className="relative rounded-full h-4 w-4 bg-[#7f5af0] flex items-center justify-center">
                    <MapPin className="h-2 w-2 text-white" />
                  </div>
                </div>
                <div className="absolute h-6 w-6 top-2/3 left-2/3 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="absolute inset-0 bg-[#00d1ff] rounded-full animate-ping opacity-75"></div>
                  <div className="relative rounded-full h-4 w-4 bg-[#00d1ff] flex items-center justify-center">
                    <MapPin className="h-2 w-2 text-white" />
                  </div>
                </div>
                <div className="absolute h-6 w-6 top-1/2 left-3/4 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="absolute inset-0 bg-[#ff5c8a] rounded-full animate-ping opacity-75"></div>
                  <div className="relative rounded-full h-4 w-4 bg-[#ff5c8a] flex items-center justify-center">
                    <MapPin className="h-2 w-2 text-white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent"></div>
            <div className="absolute bottom-0 inset-x-0 p-6 text-center bg-gradient-to-t from-[#1a1a2e] to-transparent">
              <p className="text-white/80 text-sm">
                <Map className="inline-block h-4 w-4 mr-2 align-text-bottom" />
                Powered by real-time Google Maps integration
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-[#7f5af0]/5 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Getting around campus has never been easier. Three simple steps to a smarter commute.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <div className="glass-panel border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:translate-y-[-5px] hover:shadow-[0_10px_25px_-5px_rgba(127,90,240,0.3)] transition-all duration-500">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#7f5af0] to-[#7f5af0]/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(127,90,240,0.5)]">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Book Your Ride</h3>
              <p className="text-white/60 text-center">
                Set your pickup and destination points on campus with our intuitive interface.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="glass-panel border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:translate-y-[-5px] hover:shadow-[0_10px_25px_-5px_rgba(0,209,255,0.3)] transition-all duration-500">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#00d1ff] to-[#00d1ff]/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(0,209,255,0.5)]">
                <CompassIcon className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Track Live in Real-Time</h3>
              <p className="text-white/60 text-center">
                Watch your buggy approach in real-time with accurate ETA and driver details.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="glass-panel border border-white/10 rounded-2xl p-8 backdrop-blur-md hover:translate-y-[-5px] hover:shadow-[0_10px_25px_-5px_rgba(255,92,138,0.3)] transition-all duration-500">
              <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#ff5c8a] to-[#ff5c8a]/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(255,92,138,0.5)]">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-center">Arrive with Ease</h3>
              <p className="text-white/60 text-center">
                Enjoy a comfortable ride to your destination and rate your experience.
              </p>
            </div>
          </div>
          
          <div className="flex justify-center mt-12">
            <Link to="/book">
              <Button className="bg-white/10 hover:bg-white/20 text-white border-0">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Mobile Experience Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] to-[#1a1a2e]/80"></div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7f5af0]/50 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            {/* Content */}
            <div>
              <h2 className="text-3xl font-bold mb-4">Take It On The Go</h2>
              <p className="text-white/60 mb-8">
                Our responsive web app works perfectly on mobile devices. Book, track, and manage your campus rides from anywhere.
              </p>
              
              <div className="space-y-6">
                {/* Feature 1 */}
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-[#7f5af0]/20 flex items-center justify-center mt-1 mr-4 shrink-0">
                    <Smartphone className="h-5 w-5 text-[#7f5af0]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Mobile-First Design</h3>
                    <p className="text-white/60 text-sm">
                      Optimized for touch and designed for movement, our interface is perfect for on-the-go usage.
                    </p>
                  </div>
                </div>
                
                {/* Feature 2 */}
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-[#00d1ff]/20 flex items-center justify-center mt-1 mr-4 shrink-0">
                    <Clock className="h-5 w-5 text-[#00d1ff]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Real-Time Notifications</h3>
                    <p className="text-white/60 text-sm">
                      Get instant alerts when your buggy arrives or if there are any changes to your ride.
                    </p>
                  </div>
                </div>
                
                {/* Feature 3 */}
                <div className="flex items-start">
                  <div className="h-10 w-10 rounded-full bg-[#ff5c8a]/20 flex items-center justify-center mt-1 mr-4 shrink-0">
                    <Calendar className="h-5 w-5 text-[#ff5c8a]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Schedule Ahead</h3>
                    <p className="text-white/60 text-sm">
                      Plan your campus commute by scheduling rides in advance for your classes and events.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-10">
                <Link to="/signup">
                  <Button 
                    className="bg-gradient-to-r from-[#7f5af0] via-[#00d1ff] to-[#ff5c8a] hover:opacity-90 text-white border-0 shadow-lg"
                  >
                    Get Started Now
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Phone Mockups */}
            <div className="relative h-[500px]">
              {/* Phone 1 */}
              <div className="absolute top-0 right-0 w-64 transform rotate-6 translate-x-8 translate-y-4 z-20">
                <div className="bg-[#252542] rounded-3xl p-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-sm border border-white/10">
                  <div className="rounded-2xl overflow-hidden border border-white/10">
                    <img 
                      src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
                      alt="Booking interface" 
                      className="w-full h-auto"
                    />
                  </div>
                  <div className="mt-2 px-3 flex items-center justify-between">
                    <div className="h-1 w-10 bg-white/20 rounded-full"></div>
                    <div className="h-4 w-4 rounded-full bg-[#1a1a2e] border border-white/10"></div>
                  </div>
                </div>
              </div>
              
              {/* Phone 2 */}
              <div className="absolute top-1/2 left-0 w-64 transform -translate-y-1/2 -rotate-6 z-10">
                <div className="bg-[#252542] rounded-3xl p-3 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] backdrop-blur-sm border border-white/10">
                  <div className="rounded-2xl overflow-hidden border border-white/10">
                    <div className="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1621955964441-c173e01c6cb9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
                        alt="Tracking interface" 
                        className="w-full h-auto"
                      />
                      <div className="absolute inset-0 bg-[#1a1a2e]/70"></div>
                      <div className="absolute bottom-4 left-0 right-0 p-4 text-center">
                        <div className="bg-[#252542]/80 rounded-lg p-3 backdrop-blur-sm">
                          <p className="text-white text-sm font-semibold">Arriving in</p>
                          <p className="text-[#00d1ff] text-2xl font-bold">3 min</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 px-3 flex items-center justify-between">
                    <div className="h-1 w-10 bg-white/20 rounded-full"></div>
                    <div className="h-4 w-4 rounded-full bg-[#1a1a2e] border border-white/10"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Live Stats Section */}
      <section ref={statsRef} className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Live Campus Activity</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Join hundreds of students already enjoying smarter campus mobility.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Stat 1 */}
            <div className="glass-panel rounded-2xl p-8 border border-[#7f5af0]/20 hover:border-[#7f5af0]/40 transition-all duration-300 text-center backdrop-blur-md">
              <div className="h-16 w-16 rounded-full bg-[#7f5af0]/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-[#7f5af0]" />
              </div>
              <div className="counter text-4xl font-bold mb-2 text-white" data-count="14">0</div>
              <p className="text-white/60">Buggies Online</p>
            </div>
            
            {/* Stat 2 */}
            <div className="glass-panel rounded-2xl p-8 border border-[#00d1ff]/20 hover:border-[#00d1ff]/40 transition-all duration-300 text-center backdrop-blur-md">
              <div className="h-16 w-16 rounded-full bg-[#00d1ff]/10 flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-[#00d1ff]" />
              </div>
              <div className="counter text-4xl font-bold mb-2 text-white" data-count="238">0</div>
              <p className="text-white/60">Rides Today</p>
            </div>
            
            {/* Stat 3 */}
            <div className="glass-panel rounded-2xl p-8 border border-[#ff5c8a]/20 hover:border-[#ff5c8a]/40 transition-all duration-300 text-center backdrop-blur-md">
              <div className="h-16 w-16 rounded-full bg-[#ff5c8a]/10 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-[#ff5c8a]" />
              </div>
              <div className="counter text-4xl font-bold mb-2 text-white" data-count="4">0</div>
              <p className="text-white/60">Avg. ETA (minutes)</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* User Roles Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a2e]/50 to-[#1a1a2e]"></div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7f5af0]/50 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Get Started in 2 Minutes</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Choose your role and start experiencing smarter campus mobility today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Student */}
            <div className="glass-panel rounded-2xl p-8 border border-white/10 hover:translate-y-[-5px] hover:shadow-[0_10px_25px_-5px_rgba(127,90,240,0.3)] transition-all duration-500 text-center backdrop-blur-md group">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#7f5af0] to-[#7f5af0]/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(127,90,240,0.3)] group-hover:shadow-[0_0_25px_rgba(127,90,240,0.5)] transition-all duration-300">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Student</h3>
              <p className="text-white/60 mb-6 text-sm">
                Book rides, track buggies, and get to class on time.
              </p>
              <Link to="/signup">
                <Button variant="outline" className="border-[#7f5af0]/50 text-[#7f5af0] hover:bg-[#7f5af0]/10 hover:border-[#7f5af0]">
                  Sign Up as Student
                </Button>
              </Link>
            </div>
            
            {/* Driver */}
            <div className="glass-panel rounded-2xl p-8 border border-white/10 hover:translate-y-[-5px] hover:shadow-[0_10px_25px_-5px_rgba(0,209,255,0.3)] transition-all duration-500 text-center backdrop-blur-md group">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#00d1ff] to-[#00d1ff]/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(0,209,255,0.3)] group-hover:shadow-[0_0_25px_rgba(0,209,255,0.5)] transition-all duration-300">
                <MapPin className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Driver</h3>
              <p className="text-white/60 mb-6 text-sm">
                Manage rides, navigate routes, and help students get around.
              </p>
              <Link to="/signup">
                <Button variant="outline" className="border-[#00d1ff]/50 text-[#00d1ff] hover:bg-[#00d1ff]/10 hover:border-[#00d1ff]">
                  Apply as Driver
                </Button>
              </Link>
            </div>
            
            {/* Admin */}
            <div className="glass-panel rounded-2xl p-8 border border-white/10 hover:translate-y-[-5px] hover:shadow-[0_10px_25px_-5px_rgba(255,92,138,0.3)] transition-all duration-500 text-center backdrop-blur-md group">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#ff5c8a] to-[#ff5c8a]/50 flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(255,92,138,0.3)] group-hover:shadow-[0_0_25px_rgba(255,92,138,0.5)] transition-all duration-300">
                <User className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Admin</h3>
              <p className="text-white/60 mb-6 text-sm">
                Oversee fleet operations, manage drivers, and analyze system data.
              </p>
              <Link to="/login">
                <Button variant="outline" className="border-[#ff5c8a]/50 text-[#ff5c8a] hover:bg-[#ff5c8a]/10 hover:border-[#ff5c8a]">
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#111122] to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-12 border border-white/10 backdrop-blur-md bg-gradient-to-r from-[#7f5af0]/10 via-[#00d1ff]/10 to-[#ff5c8a]/10">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your <br />Campus Experience?</h2>
              <p className="text-white/70 mb-8 max-w-xl mx-auto">
                Join thousands of students enjoying smarter, faster, and more convenient campus mobility.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link to="/book">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-[#7f5af0] to-[#00d1ff] hover:opacity-90 text-white border-0 shadow-lg w-full sm:w-auto"
                  >
                    Book Your First Ride
                  </Button>
                </Link>
                <Link to="/tracking">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/20 text-white hover:bg-white/10 hover:border-white/30 w-full sm:w-auto"
                  >
                    Explore Live Map
                  </Button>
                </Link>
              </div>
              
              <div className="mt-8 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-[#7f5af0] mr-2" />
                <span className="text-white/50 text-sm">No registration required to explore the map</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
