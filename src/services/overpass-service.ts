import axios from 'axios';

const OverpassService = {
  async fetchNearbyAmenities(lat: number, lon: number, type: 'bus_stop' | 'school' | 'mall' | 'train_station') {
    const radius = 200; // meters
    let query = '';

    switch (type) {
      case 'bus_stop':
        query = `node["highway"="bus_stop"](around:${radius},${lat},${lon});`;
        break;
      case 'school':
        query = `node["amenity"="school"](around:${radius},${lat},${lon});`;
        break;
      case 'mall':
        query = `node["shop"="mall"](around:${radius},${lat},${lon});`;
        break;
      case 'train_station':
        query = `node["railway"="station"](around:${radius},${lat},${lon});`;
        break;
      default:
        return [];
    }

    const overpassQuery = `
      [out:json];
      ${query}
      out center;
    `;

    try {
      const { data } = await axios.post(
        'https://overpass-api.de/api/interpreter',
        overpassQuery,
        { headers: { 'Content-Type': 'text/plain' } }
      );

      return data.elements.map((el: any) => ({
        name: el.tags?.name || type,
        lat: el.lat,
        lon: el.lon,
        type,
      }));
    } catch (error) {
      console.error('Overpass API error:', error);
      return [];
    }
  }
};

export default OverpassService;