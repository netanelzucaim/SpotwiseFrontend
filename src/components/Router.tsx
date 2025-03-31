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
import Home from "./Home/Home";

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/ai-recommendations" element={<AIRecommendations />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
