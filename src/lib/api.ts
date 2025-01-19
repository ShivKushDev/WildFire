// @ts-nocheck
const FIRMS_API_KEY = "fbf784a01bcbf8da048491630fe329ac";
const FIRMS_BASE_URL = "https://firms.modaps.eosdis.nasa.gov/api/area/csv/fbf784a01bcbf8da048491630fe329ac/LANDSAT_NRT/world/1";

type WildfireData = {
  latitude: number;
  longitude: number;
  confidence: number;
  brightness: number;
  scan: number;
  track: number;
  acq_date: string;
  acq_time: string;
};

const fetchWildfireData = async (bounds: {
  north: number;
  south: number;
  east: number;
  west: number;
}) => {
  try {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    const response = await fetch(
      `${FIRMS_BASE_URL}/${formattedDate}/${bounds.north}/${bounds.south}/${bounds.east}/${bounds.west}/1`,
    );
    console.log(response);
    const text = await response.text();

    // Parse CSV
    const lines = text.split("\n").slice(1); // Remove header
    const wildfires = lines
      .filter((line) => line.trim())
      .map((line) => {
        const [
          latitude,
          longitude,
          brightness,
          scan,
          track,
          acq_time,
          acq_date,
          confidence,
        ] = line.split(",");

        return {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          brightness: parseFloat(brightness),
          scan: parseFloat(scan),
          track: parseFloat(track),
          acq_date,
          acq_time,
          confidence: parseFloat(confidence),
        };
      });

    return wildfires;
  } catch (error) {
    console.error("Error fetching wildfire data:", error);
    return [];
  }
};

export type { WildfireData };
export { fetchWildfireData };
