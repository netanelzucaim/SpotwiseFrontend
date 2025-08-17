import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar } from "@mui/material";
import Box from "@mui/material/Box";
import "../../styles/AppMenu.css";
import { LogOut, User } from "lucide-react";
import Logo from "../Logo/Logo"; 

const AppMenu: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("userId"));
  const [userMode, setUserMode] = useState(localStorage.getItem("mode"));
  const location = useLocation();

  useEffect(() => {
    const handleStatusChange = () => {
      setIsLoggedIn(!!localStorage.getItem("userId"));
      setUserMode(localStorage.getItem("mode"));
    };

    window.addEventListener("loginStatusChanged", handleStatusChange);

    handleStatusChange();

    return () => {
      window.removeEventListener("loginStatusChanged", handleStatusChange);
    };
  }, [location.pathname]);

  const destination =
    userMode === "Real Estate" ? "/real-estate-profile" : "/business-profile";

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("mode");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("loginStatusChanged"));
  };

  if (!isLoggedIn) return null;

  const getDestination = () => {
    const mode = localStorage.getItem("mode");
    return mode === "Real Estate" ? "/real-estate-profile" : "/business-profile";
  };

  return (
    <div>
      <AppBar position="fixed" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Logo />
          <Box display="flex" gap={3}>
            <Link to="/discover-locations">Discover</Link>
            <Link to="/ai-recommendations">Help</Link>
            <Link to="/map">Map</Link>
            <Link to={getDestination()}>
              <User fontSize="small" />
            </Link>
            <Link to="/login" onClick={handleLogout}>
              <LogOut fontSize="small" />
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <div className="space-div"></div>
    </div>
  );
};

export default AppMenu;