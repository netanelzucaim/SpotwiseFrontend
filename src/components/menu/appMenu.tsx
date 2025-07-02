import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppBar, Toolbar } from "@mui/material";
import Box from "@mui/material/Box";
import "../../styles/AppMenu.css";
import { LogOut, User } from "lucide-react";
import Logo from "../Logo/Logo";

const AppMenu: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("userId")
  );

  useEffect(() => {
    const handleStatusChange = () => {
      setIsLoggedIn(!!localStorage.getItem("userId"));
    };

    window.addEventListener("loginStatusChanged", handleStatusChange);

    return () => {
      window.removeEventListener("loginStatusChanged", handleStatusChange);
    };
  }, []);

  const userMode = localStorage.getItem("mode");
  const destination =
    userMode === "Real Estate" ? "/real-estate-profile" : "/business-profile";

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("mode");
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("loginStatusChanged"));
  };

  if (!isLoggedIn) return null;

  return (
    <div>
      <AppBar position="fixed" color="default" elevation={1}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Logo></Logo>
          <Box display="flex" gap={3}>
            <Link to="/discover-locations">Discover</Link>
            <Link to="/ai-recommendations">Help</Link>
            <Link to="/map">Map</Link>
            <Link to={destination}>
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
