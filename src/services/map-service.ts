import axios from 'axios';
import { MAPTILER_API_KEY } from '../config';

export interface Coordinates {
    lat: number;
    lon: number;
  }

  export interface AddressSuggestion {
    label: string;
    coordinates: Coordinates;
  }

const MapService = {
    async getLatLonForAddress(fullAddress: string): Promise<Coordinates | null> {
        const cached = localStorage.getItem(fullAddress);
      
        if (cached) {
          return JSON.parse(cached);
        }
        
        if (!MAPTILER_API_KEY) {
          console.error("MATPILER_API_KEY is undefined");
          return null;
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
    },
    async getAddressSuggestions(query: string): Promise<AddressSuggestion[]> {
      if (!MAPTILER_API_KEY) {
        console.error("MAPTILER_API_KEY is undefined");
        return [];
      }
    
      try {
        const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(query)}.json?key=${MAPTILER_API_KEY}&language=he&country=IL`;
        const { data } = await axios.get(url);
    
        return data.features.map((feature: any) => ({
          label: feature.place_name,
          coordinates: {
            lat: feature.center[1],
            lon: feature.center[0],
          },
        }));
      } catch (error) {
        console.error("Failed to fetch address suggestions:", error);
        return [];
      }
    }

};

export default MapService;