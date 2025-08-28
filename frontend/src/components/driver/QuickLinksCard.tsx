import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Bell, AlertCircle, User } from "lucide-react";
import { Link } from "react-router-dom";

const QuickLinksCard: React.FC = () => {
  return (
    <Card className="glass-panel">
      <CardHeader>
        <CardTitle className="text-lg">Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        <Link to="/driver/schedule" className="w-full">
          <Button variant="outline" className="w-full justify-start">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
        </Link>
        <Link to="/driver/notifications" className="w-full">
          <Button variant="outline" className="w-full justify-start">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
        </Link>
        <Link to="/driver/alerts" className="w-full">
          <Button variant="outline" className="w-full justify-start">
            <AlertCircle className="mr-2 h-4 w-4" />
            Alerts
          </Button>
        </Link>
        <Link to="/driver/faq" className="w-full">
          <Button variant="outline" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            Driver FAQ
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default QuickLinksCard;
