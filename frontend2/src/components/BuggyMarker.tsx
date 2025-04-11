
import React from 'react';
import { cn } from '@/lib/utils';

interface BuggyMarkerProps {
  name: string;
  status: "available" | "busy" | "offline" | "maintenance";
  batteryLevel: number;
}

const BuggyMarker: React.FC<BuggyMarkerProps> = ({ name, status, batteryLevel }) => {
  const getStatusColor = () => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "busy":
        return "bg-amber-500";
      case "offline":
        return "bg-gray-500";
      case "maintenance":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getBatteryColor = () => {
    if (batteryLevel > 70) return "bg-green-500";
    if (batteryLevel > 30) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="relative">
      {/* Main marker */}
      <div className="relative transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center">
          {/* Buggy icon with pulse effect */}
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center text-white border-2 border-white",
            getStatusColor(),
            status === "available" && "animate-pulse-slow"
          )}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
              <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
              <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
            </svg>
          </div>
          
          {/* Name label with status */}
          <div className="mt-1 bg-black/70 px-2 py-1 rounded text-white text-xs font-medium shadow-lg">
            {name}
            <div className="flex items-center mt-1 justify-between">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
                <span className="ml-1 text-[10px] capitalize">{status}</span>
              </div>
              <div className="flex items-center ml-2">
                <div className={`w-2 h-2 rounded-full ${getBatteryColor()}`}></div>
                <span className="ml-1 text-[10px]">{batteryLevel}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuggyMarker;
