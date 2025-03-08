import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import React from 'react';
import AIRecommendations from './components/AiRecommendations';
import SignupForm from './components/signup/SignupForm'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';


const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* Define Routes */}
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
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