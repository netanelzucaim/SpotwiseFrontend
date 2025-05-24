import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar, 
  Toolbar
} from "@mui/material";
import Box from "@mui/material/Box";
import "../../styles/AppMenu.css";
import { LogOut, User } from "lucide-react";

// const pages = [
//   { name: "AI Help", path: "/ai-recommendations", icon: <Brain size={24} /> },
//   { name: "Discover Location", path: "/discover-locations", icon: <MapPinHouse size={24} /> },
//   { name: "Map", path: "/map", icon: <Map size={24} /> },
//   { name: "Business Profile", path: "/business-profile", icon: <BriefcaseBusiness size={24} /> },
//   { name: "Real Estate Profile", path: "/real-estate-profile", icon: <User size={24} /> },
//   { name: "Logout", path: "/login", icon: <LogOut size={24} /> }
// ];

const AppMenu: React.FC = () => {
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center">
          <img
            src="/assets/standing-wizo.png"
            alt="SpotWise Logo"
            className="logo"
          />
        <Link to="/home" className="logo-name">SpotWise</Link>
        </Box>
        <Box display="flex" gap={3}>
          <Link to="/discover-locations">
            Discover
          </Link>
          <Link to="/ai-recommendations">
            Help
          </Link>
          <Link to="/map">
            Map
          </Link>
          <Link to="/profile">
            <User fontSize="small" />
          </Link>
          <Link
            to="/login"
            onClick={() => {
              localStorage.removeItem("userId");
              localStorage.removeItem("mode");
            }}
          >
            <LogOut fontSize="small" />
          </Link>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppMenu;