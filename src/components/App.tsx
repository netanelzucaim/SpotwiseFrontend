import React from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppMenu from "./menu/appMenu";
import AppRoutes from "./Router";
import "../styles/App.css";
import BotpressChat from "./Chatbot/ChatbotButton";

const App: React.FC = () => {
  const location = useLocation();

  return (
    <div>
      {location.pathname !== "/login" && location.pathname !== "/signup" && <AppMenu />}
      <AppRoutes />
    </div>
  );
};

const AppWrapper: React.FC = () => (
  <Router>
    <App />
    <BotpressChat />
  </Router>
);

export default AppWrapper;