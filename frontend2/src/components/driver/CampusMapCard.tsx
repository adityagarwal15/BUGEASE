
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CampusMapCardProps {
  isRunning: boolean;
}

const CampusMapCard: React.FC<CampusMapCardProps> = ({ isRunning }) => {
  return (
    <Card className="overflow-hidden bg-[#1a1a2e]/70 backdrop-blur-md border border-white/10 shadow-lg">
      <CardHeader className="pb-0">
        <CardTitle className="text-white">Campus Map</CardTitle>
        <CardDescription className="text-white/70">View your current location on campus</CardDescription>
      </CardHeader>
      <CardContent className="p-0 mt-4">
        <div className="bg-[#0f0f1a]/50 aspect-video w-full flex items-center justify-center rounded-md overflow-hidden border border-white/5">
          {isRunning ? (
            <div className="text-center">
              <div className="relative">
                <MapPin className="h-8 w-8 text-[#00d1ff] mx-auto mb-2" />
                <div className="absolute inset-0 animate-ping rounded-full bg-[#00d1ff]/20"></div>
              </div>
              <p className="text-sm font-medium text-white">Live location broadcasting</p>
              <Link to="/tracking" className="text-xs text-[#00d1ff] hover:underline">
                View full tracking map
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <MapPin className="h-8 w-8 text-white/30 mx-auto mb-2 opacity-50" />
              <p className="text-sm text-white/50">
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
