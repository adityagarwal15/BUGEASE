
import React from 'react';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/10 to-background pt-16 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Last updated: April 9, 2025
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16 -mt-12">
        <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-sm p-6 md:p-8">
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              This Privacy Policy describes how CampusBuggy ("we," "us," or "our") collects, uses, and discloses your personal information when you use our campus transportation service, mobile application, and website (collectively, the "Service").
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">Information We Collect</h2>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">Personal Information</h3>
            <p>When you use our Service, we may collect the following types of personal information:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, phone number, student ID, and profile picture.</li>
              <li><strong>Location Information:</strong> GPS location data when you use our app to book rides or track buggies.</li>
              <li><strong>Transaction Information:</strong> Records of rides, pickup and drop-off locations, timestamps, and payment information.</li>
              <li><strong>Device Information:</strong> Information about the device you use to access our Service, including IP address, browser type, and operating system.</li>
              <li><strong>Communications:</strong> Records of your communications with our customer service team or feedback provided through the app.</li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">Usage Information</h3>
            <p>We also collect information about how you use our Service, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Frequency and patterns of usage</li>
              <li>Features and functions you access</li>
              <li>Time spent on the app</li>
              <li>Ride preferences</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">How We Use Your Information</h2>
            <p>We use your personal information for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Providing and improving our Service</li>
              <li>Processing and facilitating ride bookings</li>
              <li>Enabling real-time tracking of buggies</li>
              <li>Managing your account and preferences</li>
              <li>Communicating with you about your rides and account</li>
              <li>Sending service-related notifications</li>
              <li>Conducting research and analytics to enhance our Service</li>
              <li>Ensuring the safety and security of our Service</li>
              <li>Complying with legal obligations</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">Information Sharing</h2>
            <p>We may share your personal information with the following categories of recipients:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Drivers:</strong> Limited information necessary to facilitate your ride.</li>
              <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf, such as hosting, data analysis, payment processing, and customer service.</li>
              <li><strong>University Administration:</strong> Information required for the operation and supervision of campus transportation services.</li>
              <li><strong>Legal Authorities:</strong> When required by law, court order, or governmental regulation.</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, so we cannot guarantee absolute security.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">Your Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Accessing and obtaining a copy of your data</li>
              <li>Correcting inaccurate information</li>
              <li>Deleting your personal information</li>
              <li>Restricting or objecting to certain processing activities</li>
              <li>Data portability</li>
              <li>Withdrawing consent at any time</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. The updated version will be indicated by an updated "Last Updated" date and will be effective immediately upon posting. We encourage you to review this Privacy Policy periodically.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">Contact Us</h2>
            <p>
              If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> privacy@campusbuggy.com<br />
              <strong>Address:</strong> 123 University Drive, Campus Area, CA 90210<br />
              <strong>Phone:</strong> +1 (800) 123-4567
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
