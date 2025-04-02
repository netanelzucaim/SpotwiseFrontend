import React, { FC, useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import '../../styles/MapPage.css';
import { MAPTILER_API_KEY } from '../../config';
import RealEstateService  from '../../services/realestate-service';  // Service to fetch real estate data

// Define the shape of a real estate listing (if not already defined/imported)
interface iRealestate {
  city: string;
  address: string;
  owner: string;        // mongoose ObjectId as string (not used in this component)
  description: string;
  area: string;
  location: string;
}

const MapPage: FC = () => {
  // Reference to the map container DOM element and the Map instance
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  // Store all markers to reference them by index later (e.g., for opening popups)
  const markersRef = useRef<maptilersdk.Marker[]>([]);
  // State for list of real estate listings and the currently selected listing index
  const [realEstates, setRealEstates] = useState<iRealestate[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Initial map view settings (centered at Rishon LeZion as a default)
  const initialCenter = { lng: 34.792501, lat: 31.973001 };
  const initialZoom = 14;
  // Set the MapTiler API key for all MapTiler SDK requests
  maptilersdk.config.apiKey = MAPTILER_API_KEY;

  // Function to add a marker for a listing on the map, with popup and click handler
  const addMarker = (coords: { lat: number; lon: number }, listing: iRealestate, index: number) => {
    if (!map.current) return;
    // Create a popup showing the listing's description (and address for context)
    const popupContent = `<strong>${listing.address}, ${listing.city}</strong><p>${listing.description}</p>`;
    const popup = new maptilersdk.Popup().setHTML(popupContent);
    // Create a map marker at the given coordinates
    const marker = new maptilersdk.Marker().setLngLat([coords.lon, coords.lat]).setPopup(popup).addTo(map.current);
    // Store the marker in the markers array for later reference
    markersRef.current[index] = marker;
    // Add an event listener: when this marker is clicked, highlight the corresponding list button
    marker.getElement().addEventListener('click', () => {
      setSelectedIndex(index);  // mark this listing as selected in the state (for button highlight)
      // (Popup will automatically open on marker click because we attached it via setPopup)
    });
  };

  // useEffect to initialize the map and load real estate listings (runs once on component mount)
  useEffect(() => {
    if (map.current) return;  // If map is already initialized, do nothing
    // Initialize the MapTiler map
    map.current = new maptilersdk.Map({
      container: mapContainer.current!,               // container for the map
      style: maptilersdk.MapStyle.STREETS,            // map style
      center: [initialCenter.lng, initialCenter.lat], // initial center coordinates
      zoom: initialZoom                               // initial zoom level
    });

    // Fetch all real estate listings from the service
    RealEstateService.getAll().then((listings: iRealestate[]) => {
      setRealEstates(listings);  // save listings to state for rendering buttons in the panel
      // Loop through each listing and place a marker on the map
      listings.forEach((listing, index) => {
        // Combine city and address to form a full address for geocoding
        const fullAddress = `${listing.address}, ${listing.city}`;
        // Check localStorage to see if we have cached coordinates for this address
        const cachedCoords = localStorage.getItem(fullAddress);
        if (cachedCoords) {
          // Use cached coordinates if available (avoids duplicate API calls)
          const coords = JSON.parse(cachedCoords);
          addMarker({ lat: coords.lat, lon: coords.lon }, listing, index);
        } else {
          // No cached coordinates – use MapTiler Geocoding API to get lat/lng for the address
          const geocodeUrl = `https://api.maptiler.com/geocoding/${encodeURIComponent(fullAddress)}.json?key=${MAPTILER_API_KEY}`;
          fetch(geocodeUrl)
            .then(response => response.json())
            .then(data => {
              if (data && data.features && data.features.length > 0) {
                // Take the first result's coordinates (longitude, latitude)
                const [lon, lat] = data.features[0].center;
                // Cache the coordinates in localStorage for future use
                localStorage.setItem(fullAddress, JSON.stringify({ lat, lon }));
                // Add a marker on the map at these coordinates
                addMarker({ lat, lon }, listing, index);
              } else {
                console.warn(`No geocoding results for "${fullAddress}"`);
              }
            })
            .catch(err => console.error("Geocoding API error:", err));
        }
      });
    }).catch(err => console.error("Failed to fetch real estate listings:", err));
  }, []);  // empty dependency array ensures this runs only once on mount

  // Handle click on a listing button in the left panel
  const handleListingClick = (index: number) => {
    if (!map.current) return;
    // Find the marker corresponding to this listing
    const marker = markersRef.current[index];
    if (!marker) return;  // marker might not yet exist if geocoding is still in progress
    // Get the marker's coordinates and ensure the map focuses on this location
    const { lng, lat } = marker.getLngLat();
    map.current.flyTo({ center: [lng, lat], zoom: 16 });  // smoothly zoom to the listing's location
    // Open the marker's popup to show the description
    marker.togglePopup();
    // Update the selected index state to highlight this button in the panel
    setSelectedIndex(index);
  };

  return (
    <div className="map-page-container">
      <div className="info-panel">
        <h2>The real dream properties</h2>
        {/* Render a button for each real estate listing */}
        {realEstates.map((listing, index) => (
          <button 
            key={index}
            className={`listing-button ${selectedIndex === index ? 'selected' : ''}`}
            onClick={() => handleListingClick(index)}
          >
            {listing.address}, {listing.city}
          </button>
        ))}
      </div>
      <div className="map-wrap">
        {/* Map container element where the map will be rendered */}
        <div ref={mapContainer} className="map" />
      </div>
    </div>
  );
};

export default MapPage;