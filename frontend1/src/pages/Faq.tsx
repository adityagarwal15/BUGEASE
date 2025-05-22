
import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Faq = () => {
  const faqs = [
    {
      question: "What is CampusBuggy?",
      answer: "CampusBuggy is a campus transportation service that offers on-demand rides around campus using electric buggies. Our service helps students, faculty, and visitors get around campus quickly and conveniently."
    },
    {
      question: "How do I book a ride?",
      answer: "Booking a ride is simple! Just use our mobile app or website, select your pickup and drop-off locations, choose an available buggy, and confirm your booking. A driver will be on their way to pick you up."
    },
    {
      question: "How much does it cost to use CampusBuggy?",
      answer: "CampusBuggy is free for all students with valid student ID. Faculty and staff can purchase ride passes or pay per ride. Visitors can use the service for a small fee per ride."
    },
    {
      question: "What are the operating hours?",
      answer: "Our buggies operate from 7:00 AM to 10:00 PM Monday through Friday, and 9:00 AM to 8:00 PM on weekends during regular semesters. Hours may be reduced during breaks and holidays."
    },
    {
      question: "How far in advance should I book?",
      answer: "We recommend booking 5-10 minutes before your desired pickup time. During peak hours (between classes), you may want to book 10-15 minutes in advance to ensure availability."
    },
    {
      question: "Can I schedule rides in advance?",
      answer: "Yes! You can schedule rides up to 24 hours in advance through our app or website. This is especially useful for rides to early morning classes or important events."
    },
    {
      question: "How many people can fit in one buggy?",
      answer: "Our standard buggies can accommodate up to 4 passengers comfortably. We also have some larger buggies that can fit up to 6 passengers for group rides."
    },
    {
      question: "What if I need to cancel my ride?",
      answer: "You can cancel your ride anytime before the driver arrives without any penalty. We appreciate if you cancel as soon as you know you won't need the ride so others can use the buggy."
    },
    {
      question: "Are the buggies wheelchair accessible?",
      answer: "Yes, we have specially equipped buggies that are wheelchair accessible. You can request an accessible buggy when booking your ride."
    },
    {
      question: "How can I become a CampusBuggy driver?",
      answer: "If you're a student interested in becoming a part-time driver, please visit the 'Join Our Team' section on our website or contact our HR department at careers@campusbuggy.com."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/10 to-background pt-16 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about CampusBuggy services.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16 -mt-12">
        <div className="max-w-3xl mx-auto bg-card rounded-lg shadow-sm p-6 md:p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          <div className="mt-12 pt-6 border-t border-border/40">
            <h2 className="text-xl font-semibold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-6">
              If you couldn't find the answer you were looking for, please don't hesitate to reach out to our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="/contact" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md text-center"
              >
                Contact Support
              </a>
              <a 
                href="mailto:support@campusbuggy.com" 
                className="bg-muted hover:bg-muted/80 text-foreground px-6 py-3 rounded-md text-center"
              >
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
