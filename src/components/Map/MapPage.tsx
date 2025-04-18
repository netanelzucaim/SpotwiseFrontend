import { FC, useRef, useEffect, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { Box, Typography, Button, Paper } from "@mui/material";
import { MAPTILER_API_KEY } from "../../config";
import MapService from "../../services/map-service";
import RealEstateService from "../../services/realestate-service";
import { useLocation } from "react-router-dom";
import UserService from "../../services/user_service";
import BusinessService, { Business } from "../../services/business_service";
import { evaluateProperty, EvaluationResponse } from '../../services/evaluateSuccess-service';
import EvaluationPopup from '../../components/EvaluateSuccess/EvaluationPopup';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface iRealestate {
  city: string;
  address: string;
  owner: string;
  description: string;
  area: string;
  price: number;
  location: string;
  ownerFullName?: string;
}

const MapPage: FC = () => {
  const location = useLocation();
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [realEstates, setRealEstates] = useState<iRealestate[]>([]);
  const [markers, setMarkers] = useState<maptilersdk.Marker[]>([]); 
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [failedIndexes, setFailedIndexes] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const [evaluationModalOpen, setEvaluationModalOpen] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResponse | null>(null);
  const [evaluationLoading, setEvaluationLoading] = useState(false);

  const [noBusinessPopupOpen, setNoBusinessPopupOpen] = useState(false);

  const navigate = useNavigate();

  const initialCenter = { lng: 34.792501, lat: 31.973001 };
  const initialZoom = 14;
  maptilersdk.config.apiKey = MAPTILER_API_KEY;

  const addMarker = (coords: { lat: number; lon: number }, listing: iRealestate, index: number) => {
    if (!map.current) return;
    const popupContent = `<strong>${listing.address}, ${listing.city}</strong><p>${listing.description}</p>`;
    const popup = new maptilersdk.Popup().setHTML(popupContent);
    const marker = new maptilersdk.Marker().setLngLat([coords.lon, coords.lat]).setPopup(popup).addTo(map.current);

    setMarkers((prevMarkers) => {
      const updatedMarkers = [...prevMarkers];
      updatedMarkers[index] = marker;
      return updatedMarkers;
    });

    console.log(`Marker added for index ${index}:`, coords);

    marker.getElement().addEventListener("click", () => {
      setSelectedIndex(index);
      scrollToItem(index); 
    });
  };

  const scrollToItem = (index: number) => {
    if (itemRefs.current[index]) {
      itemRefs.current[index]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  useEffect(() => {
    if (map.current) return;

    // Initialize the map
    map.current = new maptilersdk.Map({
      container: mapContainer.current!,
      style: maptilersdk.MapStyle.STREETS,
      center: [initialCenter.lng, initialCenter.lat],
      zoom: initialZoom,
    });

    const fetchRealEstatesWithUserNames = async () => {
        // Fetch all real estates
        const data = await RealEstateService.getAll();

        // Fetch user names for each real estate
        const realEstatesWithUserNames = await Promise.all(
          data.map(async (realEstate) => {
            const user = await UserService.getUser(realEstate.owner); 
            return {
              ...realEstate,
              ownerFullName: user.fullName, 
            };
          })
        );

        setRealEstates(realEstatesWithUserNames);

        // Add markers for each real estate
        for (const [index, listing] of realEstatesWithUserNames.entries()) {
          const fullAddress = `${listing.address}, ${listing.city}`;

            try {
              const coords = await MapService.getLatLonForAddress(fullAddress, listing.location); 
              console.log("Fetched coordinates:", coords, fullAddress);
              if (coords) {
                addMarker(coords, listing, index);
              } else {
                console.log(`Failed to fetch coordinates for ${fullAddress}`);
                setFailedIndexes((prev) => new Set(prev).add(index));
              }
            } catch (error) {
              console.error(`Error fetching coordinates for ${fullAddress}:`, error);
            }
          }
        
    };

    fetchRealEstatesWithUserNames();
  }, []); 

  useEffect(() => {
    if (location.state && markers.length > 0 && markers[location.state.index]) {
      console.log("Markers are ready, moving to location...");
      setSelectedIndex(location.state.index);
      handleListingClick(location.state.index);
      scrollToItem(location.state.index); 
    }
  }, [location, markers]); 

  const handleListingClick = (index: number) => {
    if (!map.current) return;
    const marker = markers[index];
    if (!marker) return;
    const { lng, lat } = marker.getLngLat();
    map.current.flyTo({ center: [lng, lat], zoom: 16 });
    marker.togglePopup();
    setSelectedIndex(index);
    scrollToItem(index);
  };

  const handleEvaluate = async (index: number) => {
    setEvaluationModalOpen(true);
    setEvaluationResult(null);
    setEvaluationLoading(true);
    try {
      const property = realEstates[index];
      const businessDescription: Business | null = await BusinessService.getCurrentUserBusiness();

      if (!businessDescription) {
        setEvaluationModalOpen(false);
        setNoBusinessPopupOpen(true);
        return;
      }

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
    <Box display="flex" width="100%" height="100vh">
      {/* Info Panel */}
      <Box
        sx={{
          width: 350,
          backgroundColor: "#f0f0f0",
          padding: 2,
          overflowY: "auto",
          borderRight: "1px solid #de9292",
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{
            marginTop: 4,
            textAlign: "center",
          }}
        >
          Properties For You
        </Typography>
        {error && (
          <Paper
            sx={{
              backgroundColor: "#eb8686",
              color: "#a00",
              padding: 2,
              marginBottom: 2,
              border: "1px solid #a00",
              borderRadius: 2,
              position: "relative",
            }}
          >
            {error}
            <Button
              onClick={() => setError(null)}
              sx={{
                position: "absolute",
                top: 4,
                right: 6,
                background: "transparent",
                color: "#a00",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              X
            </Button>
          </Paper>
        )}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2, 
          }}
        >
          {realEstates.map((listing, index) => (
            <Box
              key={index}
              ref={(el) => (itemRefs.current[index] = el as HTMLDivElement | null)} 
              sx={{
                backgroundColor: selectedIndex === index ? "#d0e8ff" : "#fff",
                borderRadius: 1,
                padding: 2,
                boxShadow: selectedIndex === index ? "0px 4px 10px rgba(0, 0, 0, 0.2)" : "none",
                transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                  cursor: "pointer",
                },
              }}
              onClick={() => handleListingClick(index)}
            >
              {failedIndexes.has(index) ? (
                <Typography color="error" variant="body2">
                  Seems like we can't pinpoint this one...
                </Typography>
              ) : (
                <>
                  <Typography variant="h6" gutterBottom>
                    {listing.city}, {listing.address}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Area: {listing.area}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Owner: {listing.ownerFullName || listing.owner}
                  </Typography>
                </>
              )}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Map */}
      <Box flex={1} position="relative">
        <Box ref={mapContainer} sx={{ width: "100%", height: "100%" }} />
      </Box>
    </Box>
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
                    Price: {listing.price} ₪
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
      <Dialog open={noBusinessPopupOpen} onClose={() => setNoBusinessPopupOpen(false)}>
        <DialogTitle>
          Business Profile Required
          <IconButton
            aria-label="close"
            onClick={() => setNoBusinessPopupOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <p>It seems like you don't own a business. Create your business profile now!</p>
          <Button variant="contained" color="primary" onClick={() => navigate('/business-profile')}>
            Go to Business Profile
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MapPage;