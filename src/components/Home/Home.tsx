import React, { useState, useEffect } from "react";
import "../../styles/Home.css";

const HomePage: React.FC = () => {
  const bubbleImages = [
    "/posters/poster_1.JPG",
    "/posters/poster_2.JPG",
    "/posters/poster_3.JPG"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % bubbleImages.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? bubbleImages.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel-container">
      <button className="arrow left-arrow" onClick={goToPrev}>
        ‹
      </button>
      <div className="carousel">
        {bubbleImages.map((src, index) => {
          const offset = index - currentIndex;
          let className = "slide";
          if (offset === 0) className += " center";
          else if (offset === -1 || (currentIndex === 0 && index === bubbleImages.length - 1)) className += " left";
          else if (offset === 1 || (currentIndex === bubbleImages.length - 1 && index === 0)) className += " right";
          else className += " hidden";

          return (
            <img
              key={index}
              src={src}
              alt={`Slide ${index}`}
              className={className}
            />
          );
        })}
      </div>
      <button className="arrow right-arrow" onClick={goToNext}>
        ›
      </button>
    </div>
  );
};

export default HomePage;
