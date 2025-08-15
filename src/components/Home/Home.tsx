import React, { useState, useEffect, useRef } from "react";
import "../../styles/Home.css";
import userService from "../../services/user_service"; 
import { BrandHeading } from "../Logo/Logo";

const HomePage: React.FC = () => {
  const bubbleImages = [
    "/posters/poster_1.JPG",
    "/posters/poster_2.JPG",
    "/posters/poster_3.JPG",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const explanationRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (explanationRef.current) observer.observe(explanationRef.current);

    return () => {
      if (explanationRef.current) observer.unobserve(explanationRef.current);
    };
  }, []);

  return (
    <>
      <div className="carousel-container">
        <button className="arrow left-arrow" onClick={goToPrev}>
          ‹
        </button>
        <div className="carousel">
          {bubbleImages.map((src, index) => {
            const offset = index - currentIndex;
            let className = "slide";
            if (offset === 0) className += " center";
            else if (
              offset === -1 ||
              (currentIndex === 0 && index === bubbleImages.length - 1)
            )
              className += " left";
            else if (
              offset === 1 ||
              (currentIndex === bubbleImages.length - 1 && index === 0)
            )
              className += " right";
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
      <div className="why-spotwise-container">
        <header className="why-spotwise-title"
        >
          Why SpotWise ?
        </header>
        <section
          ref={explanationRef}
          className={`why-spotwise-content ${visible ? "visible" : ""}`}
        >
          <p>
            <b> SpotWise is a smart platform that helps business owners find the best location for their business. </b>
          </p>
          <p>
            By combining your target market, preferred area, 
            and key factors like public transport or nearby businesses, 
            SpotWise uses AI and real-time data to recommend ideal properties.
          </p>
          <p>
            It’s perfect for those who want to make confident, 
            data-driven location decisions - without needing deep local market knowledge.
          </p>
        </section>
      </div>
    </>
  );
};

export default HomePage;
