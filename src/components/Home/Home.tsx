import React, { useEffect, useState } from "react";
import "../../styles/Home.css";

const HomePage: React.FC = () => {
  const isLoggedIn = Boolean(localStorage.getItem("userId"));

  // Array of image paths to display
  const bubbleImages = [
    "/public/posters/poster_1.JPG",
    "/public/posters/poster_2.JPG",
    "/public/posters/poster_3.JPG"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bubbleImages.length);
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
          {bubbleImages.map((src, index) => (
            <div key={index} className="bubble-slide">
              <img
                src={src}
                alt={`Slide ${index + 1}`}
                className="bubble-image"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
