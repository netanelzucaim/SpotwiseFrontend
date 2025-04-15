import React, { useEffect } from "react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import AppMenu from "./menu/appMenu";
import AppRoutes from "./Router";
import "../styles/App.css";

const App: React.FC = () => {
  useEffect(() => {
    // First script: Botpress core inject.js
    const injectScript = document.createElement('script');
    injectScript.src = 'https://cdn.botpress.cloud/webchat/v2.3/inject.js';
    injectScript.async = true;
    document.body.appendChild(injectScript);

    // Second script: your specific bot script
    const botScript = document.createElement('script');
    botScript.src = 'https://files.bpcontent.cloud/2025/04/15/12/20250415123235-WWNJDCZN.js';
    botScript.async = true;
    document.body.appendChild(botScript);
  }, []);
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
  </Router>
);

export default AppWrapper;