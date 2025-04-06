import AIRecommendations from './AIRecommendations/AIRecommendations';
import SignupForm from './Signup/SignupForm';
import LoginForm from './Login/LoginForm';
import MapPage from './Map/MapPage';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DiscoverLocations from './DiscoverLocations/DiscoverLocations';
import RealEstateProfile from './Profiles/RealEstateProfile';
import BusinessProfile from './Profiles/BusinessProfile';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/ai-recommendations" element={<AIRecommendations />} />
          <Route path="/real-estate-profile" element={<RealEstateProfile />} />
          <Route path="/business-profile" element={<BusinessProfile />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/discover-locations" element={<DiscoverLocations />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/map" element={<MapPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;