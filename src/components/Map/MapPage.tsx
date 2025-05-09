import { FC, useRef, useEffect, useState } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { Box, Typography, Button, Paper, Dialog, DialogTitle, DialogContent, IconButton, Switch } from "@mui/material";
import { MAPTILER_API_KEY } from "../../config";
import MapService from "../../services/map-service";
import RealEstateService from "../../services/realestate-service";
import { useLocation } from "react-router-dom";
import UserService from "../../services/user_service";
import BusinessService, { Business } from "../../services/business_service";
import { evaluateProperty, EvaluationResponse } from '../../services/evaluateSuccess-service';
import EvaluationPopup from '../../components/EvaluateSuccess/EvaluationPopup';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import "./../../styles/MapPage.css";

interface iRealestate {
  city: string;
  address: string;
  owner: string;
  description: string;
  area: string;
  price: number;
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
  const [darkMode, setDarkMode] = useState(false);

  const [recPopupOpen, setRecPopupOpen] = useState(true);
  const [recommendationText, setRecommendationText] = useState("");

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

    marker.getElement().addEventListener("click", () => {
      setSelectedIndex(index);
      scrollToItem(index);
    });
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

    const geminiResultStr = localStorage.getItem("geminiResult");
    let recommendedId = null;
    let recommendationText = "";

    if (geminiResultStr) {
      const parsed = JSON.parse(geminiResultStr);
      recommendedId = parsed.listingId;
      recommendationText = parsed.recommendationText;
      setRecommendationText(recommendationText);
    }

    map.current = new maptilersdk.Map({
      container: mapContainer.current!,
      style: maptilersdk.MapStyle.STREETS,
      center: [initialCenter.lng, initialCenter.lat],
      zoom: initialZoom,
    });

    const fetchRealEstatesWithUserNames = async () => {
      const data = await RealEstateService.getAll();

      const realEstatesWithUserNames = await Promise.all(
        data.map(async (realEstate) => {
          const user = await UserService.getUser(realEstate.owner);
          return {
            ...realEstate,
            ownerFullName: user.fullName,
          };
        })
      );

      const recommendedIndex = realEstatesWithUserNames.findIndex(re => re._id === recommendedId);

      if (recommendedIndex !== -1) {
        setSelectedIndex(recommendedIndex);
        scrollToItem(recommendedIndex);

        const fullAddress = `${realEstatesWithUserNames[recommendedIndex].address}, ${realEstatesWithUserNames[recommendedIndex].city}`;
        try {
          const coords = await MapService.getLatLonForAddress(fullAddress);
          if (coords && map.current) {
            map.current.flyTo({ center: [coords.lon, coords.lat], zoom: 18 });
          }
        } catch (err) {
          console.error("Couldn't fetch coordinates for recommended listing:", err);
        }
      }
      

      setRealEstates(realEstatesWithUserNames);

      for (const [index, listing] of realEstatesWithUserNames.entries()) {
        const fullAddress = `${listing.address}, ${listing.city}`;

        try {
          const coords = await MapService.getLatLonForAddress(fullAddress);
          if (coords) {
            addMarker(coords, listing, index);
          } else {
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
      setSelectedIndex(location.state.index);
      handleListingClick(location.state.index);
      scrollToItem(location.state.index);
    }
  }, [location, markers]);

  useEffect(() => {
    return () => {
      localStorage.removeItem("geminiResult");
      console.log("🧹 Gemini result cleared on unmount");
    };
  }, []);

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

  return (
    <Box className={`map-page-container ${darkMode ? "dark-mode" : ""}`}>
      <Box className="info-panel">
        <Box display="flex" alignItems="center" justifyContent="right" gap={1}>
          <Typography variant="h5" className="info-panel-title" textAlign={"center"}>
            Properties For You
          </Typography>
          <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
        </Box>
        {error && (
          <Paper className="error-popup">
            {error}
            <Button onClick={() => setError(null)}>X</Button>
          </Paper>
        )}
        <Box className="listings-container">
          {realEstates.map((listing, index) => (
            <Box
              key={index}
              ref={(el) => (itemRefs.current[index] = el as HTMLDivElement | null)}
              className={`listing-box ${selectedIndex === index ? "selected" : ""}`}
              onClick={() => handleListingClick(index)}
            >
              <Typography variant="h6">{listing.city}, {listing.address}</Typography>
              <Typography variant="body2">Area: {listing.area}</Typography>
              <Typography variant="body2">Price: {listing.price} ₪</Typography>
              <Typography variant="body2">Owner: {listing.ownerFullName || listing.owner}</Typography>
              <Button className="evaluate-button" onClick={() => handleEvaluate(index)}>
                Evaluate your business success here✨
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
      <Box className="map-wrap">
        <Box ref={mapContainer} className="map" />
      </Box>
      {recPopupOpen && recommendationText && (
        <Paper className="recommendation-popup">
          <Typography variant="body1">{recommendationText}</Typography>
          <Button onClick={() => setRecPopupOpen(false)}>Close</Button>
        </Paper>
      )}
      {!recPopupOpen && (
        <button className="floating-ai-btn" onClick={() => setRecPopupOpen(true)}>
          💬 AI Tip
        </button>
      )}
      <EvaluationPopup
        open={evaluationModalOpen}
        onClose={() => setEvaluationModalOpen(false)}
        evaluationResult={evaluationResult}
        evaluationLoading={evaluationLoading}
        darkMode={darkMode}
      />
      <Dialog open={noBusinessPopupOpen} onClose={() => setNoBusinessPopupOpen(false)}>
        <DialogTitle>
          Business Profile Required
          <IconButton onClick={() => setNoBusinessPopupOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <p>It seems like you don't own a business. Create your business profile now!</p>
          <Button variant="contained" onClick={() => navigate('/business-profile')}>
            Go to Business Profile
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MapPage;