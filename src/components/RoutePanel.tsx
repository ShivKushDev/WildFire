import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Clock, MapPin, AlertTriangle, Navigation } from "lucide-react";

interface RouteInfo {
  eta: string;
  distance: string;
  riskLevel: "low" | "medium" | "high";
  destination: string;
  alternativeRoutes: Array<{
    id: string;
    name: string;
    eta: string;
    riskLevel: "low" | "medium" | "high";
  }>;
}

interface RoutePanelProps {
  routeInfo?: RouteInfo;
  onRouteChange?: (routeId: string) => void;
  isOpen?: boolean;
}

const defaultRouteInfo: RouteInfo = {
  eta: "25 mins",
  distance: "12.5 miles",
  riskLevel: "low",
  destination: "Mountain View Community Center",
  alternativeRoutes: [
    {
      id: "1",
      name: "Route via Highway 101",
      eta: "30 mins",
      riskLevel: "low",
    },
    {
      id: "2",
      name: "Route via El Camino Real",
      eta: "35 mins",
      riskLevel: "medium",
    },
    {
      id: "3",
      name: "Route via Foothill Expy",
      eta: "40 mins",
      riskLevel: "high",
    },
  ],
};

const RoutePanel = ({
  routeInfo = defaultRouteInfo,
  onRouteChange = () => {},
  isOpen = true,
}: RoutePanelProps) => {
  const getRiskBadgeColor = (risk: "low" | "medium" | "high") => {
    switch (risk) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-red-500";
    }
  };

  if (!isOpen) return null;

  return (
    <Card className="fixed left-4 top-20 w-96 bg-white shadow-xl">
      <div className="p-4 space-y-4">
        {/* Main Route Info */}
        <div className="space-y-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Current Route
          </h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{routeInfo.eta}</span>
            </div>
            <Badge variant="secondary">{routeInfo.distance}</Badge>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{routeInfo.destination}</span>
          </div>
          <Badge
            className={`${getRiskBadgeColor(routeInfo.riskLevel)} text-white`}
          >
            {routeInfo.riskLevel.toUpperCase()} RISK
          </Badge>
        </div>

        {/* Alternative Routes */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alternative Routes
          </h3>
          <ScrollArea className="h-48">
            <div className="space-y-2">
              {routeInfo.alternativeRoutes.map((route) => (
                <Card key={route.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{route.name}</p>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          {route.eta}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${getRiskBadgeColor(route.riskLevel)} text-white text-xs`}
                      >
                        {route.riskLevel.toUpperCase()}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRouteChange(route.id)}
                      >
                        Select
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
};

export default RoutePanel;
