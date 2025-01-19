import React from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import {
  Layers,
  Navigation,
  Car,
  AlertTriangle,
  LocateFixed,
} from "lucide-react";

interface MapControlsProps {
  onLayerToggle?: (layer: string) => void;
  onRiskLevelChange?: (level: number) => void;
  onTrafficToggle?: (enabled: boolean) => void;
  onFindSafeRoute?: () => void;
  activeLayers?: string[];
  riskLevel?: number;
  trafficEnabled?: boolean;
}

const MapControls = ({
  onLayerToggle = () => {},
  onRiskLevelChange = () => {},
  onTrafficToggle = () => {},
  onFindSafeRoute = () => {},
  activeLayers = ["wildfires", "safeZones"],
  riskLevel = 50,
  trafficEnabled = true,
}: MapControlsProps) => {
  return (
    <Card className="fixed top-20 right-4 w-80 p-4 bg-gray-900/90 backdrop-blur-sm shadow-lg z-10 border-red-900">
      <div className="space-y-6">
        {/* Layer Controls */}
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 text-red-500">
            <Layers className="w-5 h-5" />
            Map Layers
          </h3>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="wildfires"
                className="flex items-center gap-2 text-red-400"
              >
                <AlertTriangle className="w-4 h-4 text-red-500" />
                Wildfires
              </Label>
              <Switch
                id="wildfires"
                checked={activeLayers.includes("wildfires")}
                onCheckedChange={() => onLayerToggle("wildfires")}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="safeZones"
                className="flex items-center gap-2 text-green-400"
              >
                <Navigation className="w-4 h-4 text-green-500" />
                Safe Zones
              </Label>
              <Switch
                id="safeZones"
                checked={activeLayers.includes("safeZones")}
                onCheckedChange={() => onLayerToggle("safeZones")}
              />
            </div>
          </div>
        </div>

        {/* Risk Level Control */}
        <div>
          <h3 className="text-lg font-semibold mb-2 text-red-500">
            Risk Level Threshold
          </h3>
          <Slider
            value={[riskLevel]}
            onValueChange={(value) => onRiskLevelChange(value[0])}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>

        {/* Traffic Monitoring */}
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-2 text-red-500">
            <Car className="w-5 h-5" />
            Traffic Monitoring
          </h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="traffic" className="text-gray-300">
              Show Live Traffic
            </Label>
            <Switch
              id="traffic"
              checked={trafficEnabled}
              onCheckedChange={onTrafficToggle}
            />
          </div>
        </div>

        {/* Find Safe Route Button */}
        <Button
          className="w-full bg-red-700 hover:bg-red-800 text-white"
          variant="default"
          onClick={onFindSafeRoute}
        >
          <LocateFixed className="w-4 h-4 mr-2" />
          Find Nearest Safe Route
        </Button>
      </div>
    </Card>
  );
};

export default MapControls;
