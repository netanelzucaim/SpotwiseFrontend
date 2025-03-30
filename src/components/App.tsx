import AIRecommendations from './AIRecommendations/AIRecommendations';
import SignupForm from './Signup/SignupForm';
import LoginForm from './Login/LoginForm';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import DiscoverLocations from './DiscoverLocations/DiscoverLocations';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/ai-recommendations" element={<AIRecommendations />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/real-state" element={<DiscoverLocations />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;