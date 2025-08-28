import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

const DriverFaq = () => {
  const faqItems = [
    {
      question: "How do I start broadcasting my location?",
      answer:
        "Go to your Driver Dashboard and toggle the 'Broadcasting Location' switch to enable GPS tracking. Make sure to grant location permissions to the site when prompted by your browser.",
    },
    {
      question: "What does the 'Running' status mean?",
      answer:
        "When your buggy status is set to 'Running', your live location is being broadcast to students through the app, and you appear as available on the tracking map. This means students can see your buggy moving in real-time.",
    },
    {
      question: "Does the app work when I'm not actively using it?",
      answer:
        "The location broadcasting will only work when the browser tab is active. If you minimize the browser or navigate to another tab, location tracking may be paused or less accurate. For best results, keep the app open while driving.",
    },
    {
      question: "How accurate is the GPS tracking?",
      answer:
        "The GPS accuracy depends on your device's capabilities and environmental factors like buildings, trees, or weather. Typically, GPS accuracy is within 3-10 meters in optimal conditions.",
    },
    {
      question: "Will tracking use a lot of my data plan?",
      answer:
        "No, location tracking uses minimal data. The app sends small location updates periodically, which typically amounts to less than 1MB per hour of continuous use.",
    },
    {
      question: "What if I lose connection while driving?",
      answer:
        "If you lose your internet connection, the system will attempt to reconnect automatically. Once reconnected, your location will update again. During disconnection periods, your location won't be updated for students.",
    },
    {
      question: "How do I change my password?",
      answer:
        "Navigate to your Profile page, click on 'Change Password', then enter your current password and your new password twice. Click 'Save Changes' to update your password.",
    },
    {
      question: "I'm having technical issues with the app. What should I do?",
      answer:
        "First, try refreshing the page. If issues persist, clear your browser cache and log in again. For ongoing problems, contact the system administrator or IT support team.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <div className="flex items-center space-x-2">
              <HelpCircle className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">Driver FAQ</h1>
            </div>
            <p className="text-muted-foreground mt-2">
              Frequently asked questions for campus buggy drivers
            </p>
          </div>
        </div>

        <Card className="glass-panel mb-8">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Essential information for buggy drivers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqItems.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{item.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Still need help?</CardTitle>
            <CardDescription>
              Contact the campus transportation department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              If you couldn't find an answer to your question, please contact
              the campus transportation department:
            </p>
            <div className="space-y-2 text-muted-foreground">
              <p>Email: transport@campus.edu</p>
              <p>Phone: (555) 123-4567</p>
              <p>Office Hours: Monday-Friday, 8:00 AM - 5:00 PM</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default DriverFaq;
