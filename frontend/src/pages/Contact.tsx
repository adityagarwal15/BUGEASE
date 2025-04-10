
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Mail, Phone, Clock, Send } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import GoogleMapsLoader from '@/components/GoogleMapsLoader';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message sent successfully!",
        description: "We've received your message and will get back to you soon.",
      });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  // Campus location for the map (same as used in tracking page)
  const campusCenter = {  lat:13.3473, lng: 74.7933 };

  const handleMapLoad = (map: google.maps.Map) => {
    // Add marker for the campus location
    const marker = new google.maps.Marker({
      position: campusCenter,
      map: map,
      title: "CampusBuggy Office",
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#9b87f5',
        fillOpacity: 0.8,
        strokeColor: '#9b87f5',
        strokeWeight: 1,
        scale: 10
      }
    });

    // Add info window to the marker
    const contentString = `
      <div style="padding: 8px; min-width: 150px;">
        <h3 style="margin: 0; font-weight: bold; color: #9b87f5;">Campus Buggy Office</h3>
        <p style="margin: 4px 0;">123 University Drive<br>Campus Area, CA 90210</p>
      </div>
    `;

    const infoWindow = new google.maps.InfoWindow({
      content: contentString
    });

    map.setZoom(15); // Set appropriate zoom level
    
    // Fix: Use the correct open options format
    infoWindow.open({
      anchor: marker,
      map: map
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/10 to-background pt-16 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We'd love to hear from you. Get in touch with our team.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16 -mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4">
                <CardTitle className="text-xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-muted-foreground">
                      123 University Drive<br />
                      Campus Area, CA 90210
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-muted-foreground">
                      <a href="tel:+1-800-123-4567" className="hover:text-primary transition-colors">
                        +1 (800) 123-4567
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-muted-foreground">
                      <a href="mailto:info@campusbuggy.com" className="hover:text-primary transition-colors">
                        info@campusbuggy.com
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Operating Hours</h3>
                    <p className="text-muted-foreground">
                      Monday - Friday: 7:00 AM - 10:00 PM<br />
                      Saturday - Sunday: 9:00 AM - 8:00 PM
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Quick Support</h3>
              <p className="text-muted-foreground mb-4">
                For immediate assistance with ride bookings or account issues:
              </p>
              <Button variant="secondary" className="w-full">
                Call Support Line
              </Button>
            </div>
          </div>
          
          {/* Contact Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">Name</label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">Email</label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium">Subject</label>
                    <Input 
                      id="subject" 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium">Message</label>
                    <Textarea 
                      id="message" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please provide details about your inquiry..."
                      rows={5}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </span>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Map using the GoogleMapsLoader component from the tracking page */}
        <div className="mt-16 rounded-lg overflow-hidden h-80 bg-muted">
          <GoogleMapsLoader
            center={campusCenter}
            zoom={15}
            onMapLoad={handleMapLoad}
            className="w-full h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
