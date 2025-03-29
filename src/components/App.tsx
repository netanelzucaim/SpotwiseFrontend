import RegistrationForm from "./RegistrationForm";
import AIRecommendations from './AIRecommendations/AIRecommendations';
import SignupForm from './Signup/SignupForm';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';


const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Define Routes */}
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/ai-recommendations" element={<AIRecommendations />} />
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;