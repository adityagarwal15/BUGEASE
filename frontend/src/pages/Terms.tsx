
import React from 'react';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-to-b from-primary/10 to-background pt-16 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Last updated: April 9, 2025
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16 -mt-12">
        <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-sm p-6 md:p-8">
          <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
            <p>
              Welcome to CampusBuggy. These Terms of Service ("Terms") govern your use of our campus transportation service, mobile application, and website (collectively, the "Service"). Please read these Terms carefully before using our Service.
            </p>
            
            <p className="mt-4">
              By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access or use our Service.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">1. Eligibility</h2>
            <p>
              To use our Service, you must be a current student, faculty member, staff, or authorized visitor of the university. You must be at least 18 years old or have the legal capacity to enter into these Terms under the laws of your jurisdiction.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">2. User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access to or use of your account.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">3. Service Rules</h2>
            <p>As a user of our Service, you agree to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be on time for your scheduled pickups</li>
              <li>Treat our drivers and other users with respect</li>
              <li>Not engage in any disruptive or inappropriate behavior during rides</li>
              <li>Not smoke, eat, or drink in the buggies</li>
              <li>Report any issues or safety concerns promptly</li>
              <li>Not damage or tamper with the buggies or related equipment</li>
              <li>Wear seatbelts when provided</li>
              <li>Not exceed the maximum passenger capacity of the buggy</li>
              <li>Not use the Service for illegal purposes</li>
            </ul>
            
            <h2 className="text-xl font-bold mt-8 mb-4">4. Booking and Cancellation</h2>
            <p>
              You may book rides through our app or website, subject to buggy availability. We reserve the right to refuse service or cancel bookings at our discretion, including for violation of these Terms.
            </p>
            <p className="mt-2">
              You may cancel a booking at any time before the driver arrives. Repeated no-shows or late cancellations may result in temporary service restrictions.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">5. Fees and Payment</h2>
            <p>
              Service fees, if applicable, will be clearly communicated before you confirm a booking. Payment methods and processing are subject to our Payment Policy. We reserve the right to modify our fees at any time with reasonable notice.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">6. Location Services and Data Collection</h2>
            <p>
              Our Service uses location data to provide ride services. By using our Service, you consent to the collection and use of your location data as described in our Privacy Policy.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">7. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by CampusBuggy and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any materials from our Service without our prior written consent.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">8. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, in no event shall CampusBuggy be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">9. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless CampusBuggy and its licensors, service providers, employees, agents, officers, and directors from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Service.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">10. Changes to the Terms</h2>
            <p>
              We reserve the right to modify or replace these Terms at any time at our sole discretion. The modified terms will be effective immediately upon posting. Your continued use of the Service after any such changes constitutes your acceptance of the new Terms.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">11. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the state of California, without regard to its conflict of law principles.
            </p>
            
            <h2 className="text-xl font-bold mt-8 mb-4">12. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> legal@campusbuggy.com<br />
              <strong>Address:</strong> 123 University Drive, Campus Area, CA 90210<br />
              <strong>Phone:</strong> +1 (800) 123-4567
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
