import React from "react";
import "../../styles/AIRecommendations.css";
import flyingWizo from "../../../public/assets/flying-wizo.png"; // adjust paths as needed
import standingWizo from "../../../public/assets/standing-wizo.png";

interface LoadingGeminiProps {
  phase: "searching" | "matched";
}

const LoadingGemini: React.FC<LoadingGeminiProps> = ({ phase }) => {
  return (
    <div className="loading-gemini-screen">
      <img
        src={phase === "searching" ? flyingWizo : standingWizo}
        alt="Wizo mascot"
        className={`wizo-${phase}`}
      />
      <p className="loading-message">
        {phase === "searching"
          ? "We're searching for the best place for you!"
          : "We found you a match! Hold tight, you're almost there..."}
      </p>
    </div>
  );
};

export default LoadingGemini;