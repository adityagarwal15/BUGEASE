import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Cpu,
  Smile,
  Map,
  Shield,
  BookOpen,
  Phone,
  Mail,
  Globe,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden py-16">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-primary/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-6 animate-fade-in">
              <span className="text-sm font-medium text-primary">
                About CampusBuggy
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-glow">
              Revolutionizing Campus Transportation
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Learn about our mission to make campus transportation efficient,
              sustainable, and accessible for all students and staff.
            </p>
          </div>
        </div>
      </div>

      {/* Mission and Vision */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission & Vision</h2>
            <p className="text-muted-foreground mb-6">
              CampusBuggy was founded with a simple mission: to solve the
              transportation challenges faced by students and staff on large
              university campuses. We believe that getting around campus should
              be easy, efficient, and environmentally friendly.
            </p>
            <p className="text-muted-foreground mb-6">
              Our vision is to create a seamless transportation network that
              connects all parts of campus, reducing walking times, improving
              accessibility, and decreasing the carbon footprint of daily
              commutes.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center mt-1">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Accessibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Making all campus locations easily accessible to everyone
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-secondary/20 flex items-center justify-center mt-1">
                  <Cpu className="h-4 w-4 text-secondary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">Technology</h3>
                  <p className="text-sm text-muted-foreground">
                    Leveraging advanced technology to optimize transportation
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-lg bg-accent/20 flex items-center justify-center mt-1">
                  <Smile className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">User Experience</h3>
                  <p className="text-sm text-muted-foreground">
                    Creating a seamless and enjoyable ride experience
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-panel rounded-xl overflow-hidden border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1604328698423-c8f88b18f2ca?q=80&w=1470&auto=format&fit=crop"
              alt="University Campus"
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gradient-to-b from-background to-background/95 py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/5 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-3">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              CampusBuggy combines cutting-edge technology with user-centered
              design to provide an exceptional transportation experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-panel hover:border-primary/20 transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center mb-4">
                  <Map className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Real-Time Tracking</CardTitle>
                <CardDescription>
                  Track buggies in real-time with accurate GPS locations and
                  ETAs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our advanced tracking system allows you to see exactly where
                  your buggy is and when it will arrive, eliminating the
                  guesswork from your campus transportation.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel hover:border-secondary/20 transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-secondary/20 flex items-center justify-center mb-4">
                  <Cpu className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>AI Route Optimization</CardTitle>
                <CardDescription>
                  Machine learning algorithms that optimize routes in real-time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our AI system continuously analyzes campus traffic patterns,
                  ride requests, and historical data to create the most
                  efficient routes for our buggies.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel hover:border-accent/20 transition-all duration-300">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Safety & Reliability</CardTitle>
                <CardDescription>
                  Prioritizing your safety with trained drivers and maintained
                  vehicles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  All our drivers undergo rigorous training, and our buggies are
                  regularly maintained to ensure your campus journeys are always
                  safe and reliable.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="container mx-auto py-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about the CampusBuggy service
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                Who can use the CampusBuggy service?
              </AccordionTrigger>
              <AccordionContent>
                All students, faculty, and staff with valid university IDs can
                use the CampusBuggy service. Visitors can also use the service
                with temporary passes available from the campus information
                center.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>How do I request a ride?</AccordionTrigger>
              <AccordionContent>
                You can request a ride through our mobile app or website. Simply
                log in with your university credentials, enter your pickup and
                drop-off locations, select a time, and confirm your booking.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>
                What hours does CampusBuggy operate?
              </AccordionTrigger>
              <AccordionContent>
                Our standard operating hours are 7:00 AM to 11:00 PM Monday
                through Friday, and 9:00 AM to 8:00 PM on weekends. Extended
                hours are available during special campus events and exam
                periods.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>
                Is there a cost to use CampusBuggy?
              </AccordionTrigger>
              <AccordionContent>
                CampusBuggy is a free service provided by the university for all
                students, faculty, and staff. It's funded through university
                transportation fees that are included in tuition and employment
                benefits.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>
                How far in advance can I book a ride?
              </AccordionTrigger>
              <AccordionContent>
                You can book rides up to 7 days in advance. For immediate needs,
                our on-demand service will match you with the nearest available
                buggy, typically with wait times under 10 minutes during regular
                hours.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gradient-to-b from-background to-background/95 py-20 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-3">Contact Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions or suggestions? We'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="glass-panel text-center">
              <CardContent className="pt-6">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-medium mb-1">Phone</h3>
                <p className="text-muted-foreground">(555) 123-4567</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Mon-Fri, 8AM-6PM
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel text-center">
              <CardContent className="pt-6">
                <div className="mx-auto h-12 w-12 rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                  <Mail className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="font-medium mb-1">Email</h3>
                <p className="text-muted-foreground">support@campusbuggy.edu</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Always available
                </p>
              </CardContent>
            </Card>

            <Card className="glass-panel text-center">
              <CardContent className="pt-6">
                <div className="mx-auto h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <Globe className="h-5 w-5 text-accent" />
                </div>
                <h3 className="font-medium mb-1">Office</h3>
                <p className="text-muted-foreground">Transportation Center</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Campus Main Building, Room 101
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button className="group">
              Send us a message
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
