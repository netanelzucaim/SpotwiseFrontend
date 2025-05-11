import maplibregl from 'maplibre-gl';
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
          continue;
        }
      
        for (const amenity of overpassResults) {
          const coords = { lat: amenity.lat, lon: amenity.lon };
      
          const feature = buildPolygonForType(coords, {
            phrase: amenity.name,
            type: amenity.type,
          });
      
          if (feature) {
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