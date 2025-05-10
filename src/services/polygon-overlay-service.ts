import maplibregl from 'maplibre-gl';
import axios from 'axios';
import { MAPTILER_API_KEY } from '../config';
import MapService from '../services/map-service'
import OverpassService from '../services/overpass-service';

type ParsedLocation = {
  phrase: string;
  type: 'school' | 'bus_stop' | 'train_station' | 'mall' | 'street';
};

type Coordinates = {
  lat: number;
  lon: number;
};

const radiusByType: Record<ParsedLocation["type"], number> = {
    school: 0.0008,
    mall: 0.0001,
    train_station: 0.0001,
    bus_stop: 0.00015,
    street: 0.003,
};

const locationKeywords = [
  { key: 'school', aliases: ['school', 'תיכון', 'חטיבת ביניים'] },
  { key: 'bus_stop', aliases: ['bus stop', 'תחנת אוטובוס'] },
  { key: 'train_station', aliases: ['train', 'רכבת'] },
  { key: 'mall', aliases: ['mall', 'קניון', 'shopping center'] },
  { key: 'street', aliases: ['street', 'רחוב'] },
];

const PolygonOverlayService = {
async drawAIReasoningPolygons(map: maplibregl.Map, geminiText: string, listingAddress: string): Promise<void> {
    const mentions = extractLocationMentions(geminiText);
    console.log("🧠 Parsed mentions:", mentions);
    const features = [];

    for (const mention of mentions) {
        const listingCoords = await MapService.getLatLonForAddress(listingAddress);
        if (!listingCoords) continue;
      
        const overpassResults = await OverpassService.fetchNearbyAmenities(
          listingCoords.lat,
          listingCoords.lon,
          mention.type
        );
      
        if (overpassResults.length === 0) {
          console.warn(`❌ No ${mention.type} found near listing.`);
          continue;
        }
      
        for (const amenity of overpassResults) {
          const coords = { lat: amenity.lat, lon: amenity.lon };
      
          const feature = buildPolygonForType(coords, {
            phrase: amenity.name,
            type: amenity.type,
          });
      
          if (feature) {
            console.log("🟠 Drawing polygon at:", coords, "for", amenity.name);
            features.push(feature);
          }
        }
      }

    if (features.length === 0) return;

    const geojson = {
      type: 'FeatureCollection',
      features,
    };

    if (map.getSource('ai-reasoning')) {
      (map.getSource('ai-reasoning') as maplibregl.GeoJSONSource).setData(geojson);
    } else {
      map.addSource('ai-reasoning', { type: 'geojson', data: geojson });

      map.addLayer({
        id: 'ai-reasoning-fill',
        type: 'fill',
        source: 'ai-reasoning',
        paint: {
            'fill-color': [
              'match',
              ['get', 'type'],
              'school', '#42a5f5',       // blue
              'bus_stop', '#66bb6a',     // green
              'train_station', '#ab47bc',// purple
              'mall', '#ff7043',         // orange
              'street', '#78909c',       // gray
              '#ffa726' // fallback
            ],
            'fill-opacity': 0.4,
        },
        filter: ['==', '$type', 'Polygon'],
      });

      map.on('click', 'ai-reasoning-fill', (e) => {
        const props = e.features?.[0]?.properties;
        if (props) {
          new maplibregl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<b>${props.name}</b><br/>${props.reason}`)
            .addTo(map);
        }
      });

      map.on('mouseenter', 'ai-reasoning-fill', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'ai-reasoning-fill', () => {
        map.getCanvas().style.cursor = '';
      });
    }
  }
};

function extractCityFromText(text: string): string {
    const match = text.match(/(?:ב|at)\s(?:[^,]+),\s([^,]+),\sישראל/); // Hebrew or English format
    if (match && match[1]) {
      console.log("🏙️ Extracted city:", match[1]);
      return match[1].trim();
    }
  
    // fallback: look for the first occurrence of a Hebrew city name
    const fallback = text.match(/(?:[^,]+),\s([^,]+),\sישראל/);
    if (fallback && fallback[1]) {
      console.log("🏙️ Extracted fallback city:", fallback[1]);
      return fallback[1].trim();
    }
  
    return "Israel"; // default fallback
  }

function extractLocationMentions(text: string): ParsedLocation[] {
  const lower = text.toLowerCase();
  const found: ParsedLocation[] = [];

  for (const type of locationKeywords) {
    for (const alias of type.aliases) {
      const regex = new RegExp(`near (.*?)${alias}`, 'i');
      const match = text.match(regex);
      if (match && match[1]) {
        found.push({ phrase: match[1].trim() + alias, type: type.key as ParsedLocation['type'] });
      } else if (lower.includes(alias)) {
        found.push({ phrase: alias, type: type.key as ParsedLocation['type'] });
      }
    }
  }

  return found;
}

async function geocodeLocation(placeName: string): Promise<Coordinates | null> {
  try {
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(placeName)}.json?key=${MAPTILER_API_KEY}&language=he&country=IL`;
    const { data } = await axios.get(url);

    if (data?.features?.[0]?.center) {
      const [lon, lat] = data.features[0].center;
      return { lat, lon };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

function getDistanceBetweenCoords(a: Coordinates, b: Coordinates): number {
    const R = 6371000; // Earth radius in meters
    const toRad = (deg: number) => deg * Math.PI / 180;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lon - a.lon);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
  
    const x = dLon * Math.cos((lat1 + lat2) / 2);
    const y = dLat;
    return Math.sqrt(x * x + y * y) * R;
  }

function buildPolygonForType(coords: Coordinates, mention: ParsedLocation): GeoJSON.Feature | null {
  const { lat, lon } = coords;
  let geometry = null;

  const radius = radiusByType[mention.type]; // ~15 meters

  switch (mention.type) {
    case 'school':
    case 'mall':
    case 'train_station':
      geometry = {
        type: 'Polygon',
        coordinates: [[
          [lon - radius, lat - radius],
          [lon + radius, lat - radius],
          [lon + radius, lat + radius],
          [lon - radius, lat + radius],
          [lon - radius, lat - radius],
        ]],
      };
      break;

    case 'bus_stop':
      geometry = {
        type: 'Polygon',
        coordinates: [[
          [lon - radius / 2, lat - radius / 2],
          [lon + radius / 2, lat - radius / 2],
          [lon + radius / 2, lat + radius / 2],
          [lon - radius / 2, lat + radius / 2],
          [lon - radius / 2, lat - radius / 2],
        ]],
      };
      break;

    case 'street':
      geometry = {
        type: 'Polygon',
        coordinates: [[
          [lon - radius, lat - 0.0004],
          [lon + radius, lat - 0.0004],
          [lon + radius, lat + 0.0004],
          [lon - radius, lat + 0.0004],
          [lon - radius, lat - 0.0004],
        ]],
      };
      break;

    default:
      return null;
  }

  return {
    type: 'Feature',
    geometry,
    properties: {
        name: mention.phrase,
        reason: `Relevant: ${mention.type.replace('_', ' ')}`,
        type: mention.type,
    },
  };
}

export default PolygonOverlayService;