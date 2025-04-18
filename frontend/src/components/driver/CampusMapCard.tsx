
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CampusMapCardProps {
  isRunning: boolean;
}

const CampusMapCard: React.FC<CampusMapCardProps> = ({ isRunning }) => {
  return (
    <Card className="glass-panel overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle>Campus Map</CardTitle>
        <CardDescription>View your current location on campus</CardDescription>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <div className="bg-muted aspect-video w-full flex items-center justify-center">
          {isRunning ? (
            <div className="text-center">
              <MapPin className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-sm font-medium">Live location broadcasting</p>
              <Link to="/tracking" className="text-xs text-primary hover:underline">
                View full tracking map
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <MapPin className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">
                Map inactive while buggy is idle
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CampusMapCard;
