import React from "react";
import { Link } from "react-router-dom";
import {
  AppBar, 
  Toolbar
} from "@mui/material";
import Box from "@mui/material/Box";
import "../../styles/AppMenu.css";
import { LogOut, User } from "lucide-react";

const userMode = localStorage.getItem("mode");
const destination = userMode === "Real Estate" ? "/real-estate-profile" : "/business-profile";

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
          <Link to={destination}>
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