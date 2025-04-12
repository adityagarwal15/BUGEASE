import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NavbarHome from '@/components/NavbarHome';
import { MapPin, Calendar, Clock, Users, ArrowRight, CheckCircle, Map, Smartphone, Sparkles, GitBranch, ChevronRight } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen">
      <NavbarHome />
      
      {/* Hero Section with enhanced design */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 text-center py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541417904950-b855846fe074?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2671&q=80')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/70 to-background"></div>
        
        <div className="container relative mx-auto px-4 z-10">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block animate-fade-in bg-primary/10 text-primary rounded-full py-1 px-4 text-sm font-medium mb-4">
              Faster. Greener. Smarter.
            </span>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
              Seamless Campus Transportation
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              Your reliable ride around campus, connecting you to your classes, events, and friends with our electric buggy network.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6">
              <Link to="/book">
                <Button size="lg" className="w-full sm:w-auto hover-scale">
                  Book a Ride <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/tracking">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-background/50 backdrop-blur-sm border-primary/20 hover:border-primary/50">
                  Track Buggy
                </Button>
              </Link>
            </div>
            
            <div className="mt-16 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-primary" /> Zero Emissions
              </span>
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-primary" /> Real-time Tracking
              </span>
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-primary" /> Mobile App
              </span>
              <span className="flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-primary" /> Campus Coverage
              </span>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-20 left-0 right-0 h-40 bg-gradient-to-t from-background to-transparent"></div>
      </section>
      
      {/* Features Section with improved design */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose Campus Buggy</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Our electric buggy service offers more than just transportation - it's a complete campus mobility solution.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: On-Demand Rides */}
            <div className="bg-card hover:shadow-lg transition-all duration-300 rounded-xl p-8 hover:translate-y-[-5px]">
              <div className="mb-6 h-16 w-16 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">On-Demand Rides</h3>
              <p className="text-muted-foreground text-center">
                Request a ride anytime, anywhere on campus. No need to wait for scheduled routes.
              </p>
            </div>
            
            {/* Feature 2: Real-Time Tracking */}
            <div className="bg-card hover:shadow-lg transition-all duration-300 rounded-xl p-8 hover:translate-y-[-5px]">
              <div className="mb-6 h-16 w-16 rounded-full bg-secondary/20 text-secondary flex items-center justify-center mx-auto">
                <Map className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Real-Time Tracking</h3>
              <p className="text-muted-foreground text-center">
                Track your buggy's location in real-time and get notified when it arrives.
              </p>
            </div>
            
            {/* Feature 3: Eco-Friendly */}
            <div className="bg-card hover:shadow-lg transition-all duration-300 rounded-xl p-8 hover:translate-y-[-5px]">
              <div className="mb-6 h-16 w-16 rounded-full bg-accent/20 text-accent flex items-center justify-center mx-auto">
                <GitBranch className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-center">Eco-Friendly</h3>
              <p className="text-muted-foreground text-center">
                Our buggies are electric, reducing your carbon footprint and promoting a greener campus.
              </p>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 -z-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -z-10 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      </section>
      
      {/* How It Works Section - More visual with icons and numbers */}
      <section className="bg-muted py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1: Download the App */}
            <div className="relative">
              <div className="bg-background rounded-xl p-6 shadow-md h-full">
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">1</div>
                <div className="mb-4 h-16 w-16 rounded-full bg-background flex items-center justify-center mx-auto shadow-inner">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-center">Download the App</h3>
                <p className="text-muted-foreground text-center">
                  Get the CampusBuggy app from the App Store or Google Play.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2">
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            
            {/* Step 2: Create an Account */}
            <div className="relative">
              <div className="bg-background rounded-xl p-6 shadow-md h-full">
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">2</div>
                <div className="mb-4 h-16 w-16 rounded-full bg-background flex items-center justify-center mx-auto shadow-inner">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-center">Create an Account</h3>
                <p className="text-muted-foreground text-center">
                  Sign up with your university email and verify your student status.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2">
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            
            {/* Step 3: Request a Ride */}
            <div className="relative">
              <div className="bg-background rounded-xl p-6 shadow-md h-full">
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">3</div>
                <div className="mb-4 h-16 w-16 rounded-full bg-background flex items-center justify-center mx-auto shadow-inner">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-center">Request a Ride</h3>
                <p className="text-muted-foreground text-center">
                  Set your pickup and drop-off locations on the campus map.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2">
                <ChevronRight className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
            
            {/* Step 4: Enjoy the Ride */}
            <div>
              <div className="bg-background rounded-xl p-6 shadow-md h-full relative">
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">4</div>
                <div className="mb-4 h-16 w-16 rounded-full bg-background flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-center">Enjoy the Ride</h3>
                <p className="text-muted-foreground text-center">
                  Hop on the buggy and enjoy a quick, comfortable ride to your destination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section with improved cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Students Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border/30">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold ml-2">Fast and Convenient</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  "CampusBuggy has made getting to my early morning classes so much easier. I no longer have to rush across campus!"
                </p>
                <div className="pt-4 border-t border-border/30 flex items-center">
                  <div className="bg-primary/5 h-10 w-10 rounded-full flex items-center justify-center text-primary font-bold">SM</div>
                  <div className="ml-3">
                    <div className="text-sm font-medium">Sarah M.</div>
                    <div className="text-xs text-muted-foreground">Engineering Student</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border/30">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold ml-2">Eco-Friendly Option</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  "I love that CampusBuggy is an eco-friendly way to get around campus. It's great to have a sustainable transportation option."
                </p>
                <div className="pt-4 border-t border-border/30 flex items-center">
                  <div className="bg-accent/5 h-10 w-10 rounded-full flex items-center justify-center text-accent font-bold">JB</div>
                  <div className="ml-3">
                    <div className="text-sm font-medium">John B.</div>
                    <div className="text-xs text-muted-foreground">Environmental Science</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-card rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-border/30">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-semibold ml-2">Reliable Service</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  "CampusBuggy is always on time and the drivers are super friendly. It's a reliable service that I can always count on."
                </p>
                <div className="pt-4 border-t border-border/30 flex items-center">
                  <div className="bg-secondary/5 h-10 w-10 rounded-full flex items-center justify-center text-secondary font-bold">EL</div>
                  <div className="ml-3">
                    <div className="text-sm font-medium">Emily L.</div>
                    <div className="text-xs text-muted-foreground">Arts & Humanities</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Call to action */}
          <div className="mt-16 text-center">
            <Link to="/signup">
              <Button size="lg" className="bg-primary/90 hover:bg-primary">
                Join CampusBuggy Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
