import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import AIRecommendations from "./AIRecommendations/AIRecommendations";
import SignupForm from "./Signup/SignupForm";
import LoginForm from "./Login/LoginForm";
import MapPage from './Map/MapPage';
import DiscoverLocations from './DiscoverLocations/DiscoverLocations';
import RealEstateProfile from './Profiles/RealEstateProfile';
import BusinessProfile from './Profiles/BusinessProfile';
import Home from './Home/Home';
const AppRouter: React.FC = () => {
  return (
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/ai-recommendations" element={<AIRecommendations />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/real-estate-profile" element={<RealEstateProfile />} />
        <Route path="/business-profile" element={<BusinessProfile />} />
        <Route path="/discover-locations" element={<DiscoverLocations />} />
        <Route path="/map" element={<MapPage />} />
      </Routes>
  );
};

export default AppRouter;
