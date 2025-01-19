import React from "react";
import MapHeader from "./MapHeader";
import InteractiveMap from "./InteractiveMap";

interface HomeProps {
  isEmergency?: boolean;
  currentLocation?: string;
  walletConnected?: boolean;
  walletAddress?: string;
  onEmergencyClick?: () => void;
  onConnectWallet?: () => void;
  onRouteSelect?: (routeId: string) => void;
}

const Home = ({
  isEmergency = false,
  currentLocation = "Pacific Palisades, Los Angeles, CA",
  walletConnected = false,
  walletAddress = "0x1234...5678",
  onEmergencyClick = () => {},
  onConnectWallet = () => {},
  onRouteSelect = () => {},
}: HomeProps) => {
  return (
    <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
      <MapHeader
        currentLocation={currentLocation}
        isEmergency={isEmergency}
        onEmergencyClick={onEmergencyClick}
        onConnectWallet={onConnectWallet}
        walletConnected={walletConnected}
        walletAddress={walletAddress}
      />

      <main className="pt-16 w-full h-[calc(100vh-4rem)]">
        <InteractiveMap
          onRouteSelect={onRouteSelect}
          currentLocation={{
            lat: 34.0459,
            lng: -118.5267,
          }}
        />
      </main>
    </div>
  );
};

export default Home;
