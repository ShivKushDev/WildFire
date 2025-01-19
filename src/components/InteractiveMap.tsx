import React from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import MapControls from "./MapControls";
import RoutePanel from "./RoutePanel";
import { fetchWildfireData, WildfireData } from "@/lib/api";

interface WildfireLocation {
  id: string;
  lat: number;
  lng: number;
  severity: "low" | "medium" | "high";
}

interface SafeZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
  capacity: number;
  currentOccupancy: number;
}

interface InteractiveMapProps {
  wildfires?: WildfireLocation[];
  safeZones?: SafeZone[];
  currentLocation?: { lat: number; lng: number };
  onRouteSelect?: (routeId: string) => void;
}

// Updated to Palisades area safe zones
const defaultSafeZones: SafeZone[] = [
  {
    id: "1",
    name: "Palisades Recreation Center",
    lat: 34.0459,
    lng: -118.5267,
    capacity: 500,
    currentOccupancy: 123,
  },
  {
    id: "2",
    name: "Paul Revere Middle School",
    lat: 34.0486,
    lng: -118.533,
    capacity: 1000,
    currentOccupancy: 456,
  },
  {
    id: "3",
    name: "Santa Monica Civic Center",
    lat: 34.0153,
    lng: -118.4918,
    capacity: 2000,
    currentOccupancy: 789,
  },
];

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Updated to Palisades coordinates
const center = {
  lat: 34.0459,
  lng: -118.5267,
};

const defaultWildfires: WildfireLocation[] = [
    {
      id: "fire1",
      lat: 34.05723,
      lng: -118.5267,
      severity: "high",
    },
    {
      id: "fire2",
      lat: 34.0499,
      lng: -118.5330,
      severity: "medium",
    },
    {
      id: "fire3",
      lat: 34.0153,
      lng: -118.4918,
      severity: "low",
    },
  ];
  

// Dark red and black map style
const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
];

const InteractiveMap = ({
  safeZones = defaultSafeZones,
  currentLocation = center,
  onRouteSelect = () => {},
}: InteractiveMapProps) => {
  const [activeLayers, setActiveLayers] = React.useState([
    "wildfires",
    "safeZones",
  ]);
  const [riskLevel, setRiskLevel] = React.useState(50);
  const [trafficEnabled, setTrafficEnabled] = React.useState(true);
  const [wildfireData, setWildfireData] = React.useState<WildfireData[]>([]);
  const [directions, setDirections] =
    React.useState< google.maps.DirectionsResult | null>(null);

  const libraries = React.useMemo<("places")[]>(() => ["places"], []);
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyCrsyUYCHuEtrBJRxyDAReJ1Gy2R6gf-Zs",
    libraries: libraries,
  });

  const mapRef = React.useRef<google.maps.Map>();
  const directionsService = React.useRef<google.maps.DirectionsService>();

  const onMapLoad = React.useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    directionsService.current = new google.maps.DirectionsService();

    const fetchInitialData = () => {
      const bounds = map.getBounds();
      if (bounds) {
        const northEast = bounds.getNorthEast();
        const southWest = bounds.getSouthWest();
        fetchWildfireData({
          north: northEast.lat(),
          south: southWest.lat(),
          east: northEast.lng(),
          west: southWest.lng(),
        }).then((data) => {
          // console.log("Fetched wildfire data:", data);
          const transformedData = data.map(item => ({
            ...item,
            acq_date: item.acq_date.toString(), // Convert acq_date to string
            acq_time: item.acq_time.toString(), // Convert acq_time to string (if necessary)
            satellite: item.satellite.toString(), // Convert satellite to string
            // daynight: item.daynight.toString(), // Convert daynight to string
          }));
          setWildfireData(transformedData);
          
          
        });
      }
    };

    fetchInitialData();

  }, []);

  const findNearestSafeZone = React.useCallback(() => {
    if (!directionsService.current) return;

    const origin = new google.maps.LatLng(
      currentLocation.lat,
      currentLocation.lng,
    );

    // Calculate routes to all safe zones
    const routePromises = safeZones.map((zone) => {
      return new Promise<{
        zone: SafeZone;
        route: google.maps.DirectionsResult;
      }>((resolve, reject) => {
        directionsService.current?.route(
          {
            origin,
            destination: new google.maps.LatLng(zone.lat, zone.lng),
            travelMode: google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === google.maps.DirectionsStatus.OK && result) {
              resolve({ zone, route: result });
            } else {
              reject(status);
            }
          },
        );
      });
    });

    Promise.all(routePromises)
      .then((results) => {
        const shortestRoute = results.reduce((prev, curr) => {
          const prevDuration =
            prev.route.routes[0].legs[0].duration?.value || Infinity;
          const currDuration =
            curr.route.routes[0].legs[0].duration?.value || Infinity;
          return prevDuration < currDuration ? prev : curr;
        });
        setDirections(shortestRoute.route);
      })
      .catch((error) => console.error("Error finding routes:", error));
  }, [currentLocation, safeZones]);

  React.useEffect(() => {
    if (isLoaded && mapRef.current) {
      findNearestSafeZone();
    }
  }, [isLoaded, findNearestSafeZone]);

//   React.useEffect(() => {

//     // For debugging purposes, use static wildfire data

//     if (!wildfireData.length) {

//       setWildfireData(defaultWildfires);

//     }

//   }, [wildfireData]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="relative w-full h-full bg-gray-900">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={currentLocation}
        onLoad={onMapLoad}
        options={{
          styles: mapStyles,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          scaleControl: true,
          streetViewControl: true,
          rotateControl: true,
          fullscreenControl: true,
        }}
      >
        {/* Current Location Marker */}
        <Marker
          position={currentLocation}
          icon={{
            url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            scaledSize: new google.maps.Size(48, 48),
          }}
        />

        {/* Wildfire Markers */}
        {activeLayers.includes("wildfires") &&
          defaultWildfires.map((fire, index) => (
            <Marker
              key={`fire-${index}`}
              position={{ lat: fire.lat, lng: fire.lng }}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                scaledSize: new google.maps.Size(32, 32),
              }}
            />
          ))}
          

        {/* Safe Zone Markers */}
        {activeLayers.includes("safeZones") &&
          safeZones.map((zone) => (
            <Marker
              key={zone.id}
              position={{ lat: zone.lat, lng: zone.lng }}
              icon={{
                url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                scaledSize: new google.maps.Size(48, 48),
              }}
            />
          ))}

        {/* Directions Route */}
        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{ suppressMarkers: true }}
          />
        )}
      </GoogleMap>

      <MapControls
        activeLayers={activeLayers}
        riskLevel={riskLevel}
        trafficEnabled={trafficEnabled}
        onLayerToggle={(layer) => {
          setActiveLayers((prev) =>
            prev.includes(layer)
              ? prev.filter((l) => l !== layer)
              : [...prev, layer],
          );
        }}
        onRiskLevelChange={setRiskLevel}
        onTrafficToggle={setTrafficEnabled}
        onFindSafeRoute={findNearestSafeZone}
      />

      <RoutePanel
        isOpen={true}
        onRouteChange={onRouteSelect}
        routeInfo={
          directions
            ? {
                eta: directions.routes[0].legs[0].duration?.text || "Unknown",
                distance:
                  directions.routes[0].legs[0].distance?.text || "Unknown",
                riskLevel: "low",
                destination: "Nearest Safe Zone",
                alternativeRoutes: directions.routes.map((route, index) => ({
                  id: String(index),
                  name: `Route ${index + 1}`,
                  eta: route.legs[0].duration?.text || "Unknown",
                  riskLevel: "low",
                })),
              }
            : undefined
        }
      />
    </div>
  );
};

export default InteractiveMap;
