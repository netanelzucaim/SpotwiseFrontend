import React, { useEffect, useState } from "react";
import {
  Typography,
} from "@mui/material";
import "../../styles/Home.css";
import DiscoverLocations from "../DiscoverLocations/DiscoverLocations";

const HomePage: React.FC = () => {
  const isLoggedIn = Boolean(localStorage.getItem("userId"));

  const bubbleMessages = [
    {
      title: "Why SpotWise?",
      description: "SpotWise helps small businesses find the perfect real estate to grow and thrive.",
    },
    {
      title: "Smart Recommendations",
      description: "We use AI to analyze locations and give you smart suggestions.",
    },
    {
      title: "Save Time",
      description: "No more endless searches — we show you what fits your business best.",
    },
  ];
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bubbleMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);  

  return (
    <div>
      <div className="bubble-carousel">
        <div
          className="bubble-slider"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {bubbleMessages.map((msg, index) => (
            <div key={index} className="bubble-slide">
              <Typography sx={{ fontSize: "28px", fontWeight: "bold", color: "#007bdc", fontFamily: "var(--bs-body-font-family);" }}>{msg.title}</Typography>
              <img
                src="/assets/thumbs-up-wizo.png"
                alt="SpotWise Logo"
                className="logo"
              />
              <Typography sx={{ fontSize: "18px", color: "#007bdc", fontFamily: "var(--bs-body-font-family);" }}>{msg.description}</Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
};

export default HomePage;
