import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { AlertCircle, Wallet, MapPin } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";

interface MapHeaderProps {
  currentLocation?: string;
  isEmergency?: boolean;
  onEmergencyClick?: () => void;
  onConnectWallet?: () => void;
  walletConnected?: boolean;
  walletAddress?: string;
}

const MapHeader = ({
  currentLocation = "1234 Main St, Mountain View, CA 94043",
  isEmergency = false,
  onEmergencyClick = () => {},
  onConnectWallet = () => {},
  walletConnected = false,
  walletAddress = "0x1234...5678",
}: MapHeaderProps) => {
  return (
    <Card className="fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-sm border-b z-50">
      <div className="h-full max-w-screen-2xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            size="lg"
            variant={isEmergency ? "destructive" : "default"}
            className="font-bold flex items-center gap-2"
            onClick={onEmergencyClick}
          >
            <AlertCircle className="h-5 w-5" />
            {isEmergency ? "EMERGENCY ACTIVE" : "EMERGENCY EVACUATION"}
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">{currentLocation}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Your current location</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex items-center gap-4">
          {walletConnected ? (
            <Badge variant="outline" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">{walletAddress}</span>
            </Badge>
          ) : (
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={onConnectWallet}
            >
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Connect Wallet</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MapHeader;
