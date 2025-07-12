import axios from 'axios';

const fetchNearbyAmenities = async (lat: number, lon: number): Promise<string[]> => {
    const radius = 200;
    const overpassQuery = `
      [out:json];
      (
        node["amenity"](around:${radius},${lat},${lon});
      );
      out;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`;
  
    try {
        const response = await axios.get(url);
        const rawElements: any[] = response.data.elements || [];
        const amenities: string[] = rawElements
            .map(el => el.tags?.amenity)
            .filter(a => typeof a === 'string') as string[];
    
        return [...new Set(amenities)];
    } catch (error) {
      console.error("Overpass API error:", error);
      return [];
    }
};

export default fetchNearbyAmenities;
