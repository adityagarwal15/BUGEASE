import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MapPin, MoveLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-full p-2">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-2xl">CampusBuggy</span>
        </div>

        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold">404</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          We couldn't find the page you're looking for. The buggy might have
          taken a wrong turn!
        </p>

        <Link to="/">
          <Button className="flex items-center">
            <MoveLeft className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
