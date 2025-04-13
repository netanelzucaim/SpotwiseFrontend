import axios from 'axios';
import { MAPTILER_API_KEY } from '../config';

export interface Coordinates {
    lat: number;
    lon: number;
  }

  const extractCoordinatesFromURL = (locationURL: string): { lat: number; lon: number } | null => {
    const googleMapsRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const coordsInURL = locationURL.match(googleMapsRegex);
  
    if (coordsInURL) {
      const lat = parseFloat(coordsInURL[1]);
      const lon = parseFloat(coordsInURL[2]);
      return { lat, lon };
    }
  
    return null;
  };

const MapService = {
    async getLatLonForAddress(fullAddress: string, locationURL: string): Promise<Coordinates | null> {
        const cached = localStorage.getItem(fullAddress);
      
        if (cached) {
          console.log("Cached coordinates for address:", fullAddress, ":", cached);
          return JSON.parse(cached);
        }
        
        if (!MAPTILER_API_KEY) {
          console.error("MATPILER_API_KEY is undefined");
          return null;
        }

        const coordsFromURL = extractCoordinatesFromURL(locationURL);
        if (coordsFromURL) {
          localStorage.setItem(fullAddress, JSON.stringify(coordsFromURL));
          console.log("Coordinates extracted from URL:", coordsFromURL);
          return coordsFromURL;
        }
       
        try {
            const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(fullAddress)}.json?key=${MAPTILER_API_KEY}&language=he&country=IL`;
            const { data } = await axios.get(url);
            if (data?.features?.length > 0) {
            const [lon, lat] = data.features[0].center;
            const coords = { lat, lon };
            localStorage.setItem(fullAddress, JSON.stringify(coords));
            return coords;
            }
            return null;
        } catch (error) {
        console.error("Geocoding failed for:", fullAddress, error);
        return null;
      }
    }
};

export default MapService;