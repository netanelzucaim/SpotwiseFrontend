import { FC, useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import '../../styles/MapPage.css';
import { MAPTILER_API_KEY } from '../../config';
import MapService from '../../services/map-service';
import RealEstateService  from '../../services/realestate-service';
import BusinessService, { Business } from "../../services/business_service";
import { evaluateProperty, EvaluationResponse } from '../../services/evaluateSuccess-service';
import EvaluationPopup from '../../components/EvaluateSuccess/EvaluationPopup';

interface iRealestate {
  city: string;
  address: string;
  owner: string;
  description: string;
  area: string;
  location: string;
}

const MapPage: FC = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const markersRef = useRef<maptilersdk.Marker[]>([]);
  const [realEstates, setRealEstates] = useState<iRealestate[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [failedIndexes, setFailedIndexes] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResponse | null>(null);
  const [evaluationLoading, setEvaluationLoading] = useState(false);

  const initialCenter = { lng: 34.792501, lat: 31.973001 };
  const initialZoom = 14;
  maptilersdk.config.apiKey = MAPTILER_API_KEY;

  const addMarker = (coords: { lat: number; lon: number }, listing: iRealestate, index: number) => {
    if (!map.current) return;
    const popupContent = `<strong>${listing.address}, ${listing.city}</strong><p>${listing.description}</p>`;
    const popup = new maptilersdk.Popup().setHTML(popupContent);
    const marker = new maptilersdk.Marker().setLngLat([coords.lon, coords.lat]).setPopup(popup).addTo(map.current);
    markersRef.current[index] = marker;
    marker.getElement().addEventListener('click', () => {
      setSelectedIndex(index);
    });
  };

  useEffect(() => {
    if (map.current) return;
    map.current = new maptilersdk.Map({
      container: mapContainer.current!,
      style: maptilersdk.MapStyle.STREETS,
      center: [initialCenter.lng, initialCenter.lat],
      zoom: initialZoom
    });

    RealEstateService.getAll().then((listings: iRealestate[]) => {
      setRealEstates(listings);
      listings.forEach((listing, index) => {
        const fullAddress = `${listing.address}, ${listing.city}`;
        const cachedCoords = localStorage.getItem(fullAddress);
        if (cachedCoords) {
          const coords = JSON.parse(cachedCoords);
          addMarker({ lat: coords.lat, lon: coords.lon }, listing, index);
        } else {
          MapService.getLatLonForAddress(fullAddress).then(coords => {
            if (coords) {
              addMarker(coords, listing, index);
            } else {
              setFailedIndexes(prev => new Set(prev).add(index));
            }
          }).catch(err => console.error("Geocoding API error: ", err));
        }
      });
    }).catch(err => {
      setError("Awkward... it seems like we can't see our locations... Please check your internet or try again later.");
      console.error("Cannot fetch realEstate: ", err);
    });
  }, []);

  const handleListingClick = (index: number) => {
    if (!map.current) return;
    const marker = markersRef.current[index];
    if (!marker) return;
    const { lng, lat } = marker.getLngLat();
    map.current.flyTo({ center: [lng, lat], zoom: 16 });
    marker.togglePopup();
    setSelectedIndex(index);
  };

  const handleEvaluate = async (index: number) => {
    setEvaluationModalOpen(true);
    setEvaluationResult(null);
    setEvaluationLoading(true);
    try {
      const property = realEstates[index];
      const businessDescription: Business = await BusinessService.getCurrentUserBusiness();
      const realEstateDetails = property;
      const result = await evaluateProperty({
        businessDescription,
        realEstateDetails
      });
      setEvaluationResult(result);
    } catch (err) {
      console.error("Error during evaluation:", err);
    } finally {
      setEvaluationLoading(false);
    }
  };

  return (
    <div className="map-page-container">
      <div className="info-panel">
        <h2>Properties For You</h2>
        {error && (
          <div className="error-popup">
            {error}
            <button onClick={() => setError(null)}>X</button>
          </div>
        )}
        {realEstates.map((listing, index) => (
          <div key={index} className="listing-card">
            <button 
              className={`listing-button ${selectedIndex === index ? 'selected' : ''}`}
              onClick={() => handleListingClick(index)}
            >
              {failedIndexes.has(index) ? (
                <>Seems like we can't pinpoint this one...</>
              ) : (
                <>
                  <strong>{listing.city}</strong>
                  <br />
                  {listing.address}
                  <div className="listing-meta">
                    Area: {listing.area}
                    <br />
                  </div>
                  <button className="evaluate-button" onClick={() => handleEvaluate(index)}>
              Evaluate your business success here
            </button>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
      <div className="map-wrap">
        <div ref={mapContainer} className="map" />
      </div>
      <EvaluationPopup
        open={evaluationModalOpen}
        onClose={() => setEvaluationModalOpen(false)}
        evaluationResult={evaluationResult}
        evaluationLoading={evaluationLoading}
      />
    </div>
  );
};

export default MapPage;
