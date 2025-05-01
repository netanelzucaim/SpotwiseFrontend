import React, { useState } from "react";
import RealEstateService from "../../services/realestate-service";
import GeminiService from "../../services/gemini-service";
import "../../styles/AIRecommendations.css";
import { useNavigate } from "react-router-dom";

interface RealEstate {
  city: string;
  address: string;
  owner: string;
  description: string;
  area: string;
  location: string;
  _id: string;
}

const AIRecommendations: React.FC = () => {
  const [dream, setDream] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState<string>("Next");
  const [realEstateId, setRealEstateId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNext = async () => {
    setLoading(true);
    setError(null);

    try {
      const allRealEstate: RealEstate[] = await RealEstateService.getAll();
      const response = await GeminiService.analyzeDream(dream, allRealEstate);

      if (!response) {
        setError("Could not get recommendations from AI.");
        setLoading(false);
        return;
      }

      if (buttonText === "The Best Option on the Map" && realEstateId) {
        const index = allRealEstate.findIndex((re) => re._id === realEstateId);

        navigate("/map", {
          state: {
            index,
          },
        });
        return;
      }

      const idMatch = response.match(/id:\s*(.*)/);
      const descMatch = response.match(/description:\s*([\s\S]*?)\nid:/);

      const extractedId = idMatch ? idMatch[1].trim() : null;
      const descriptionText = descMatch ? descMatch[1].trim() : response;

      if (!extractedId) {
        setError("Couldn't find real estate ID in AI response.");
        setLoading(false);
        return;
      }

      setDream(descriptionText);
      setRealEstateId(extractedId);
      setButtonText("The Best Option on the Map");
    } catch (err: any) {
      setError(err.message || "An error occurred.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-recommendations-container">
      <div className="header">
        <h1>SpotWise</h1>
        <p>Your Vision, The Perfect Location.</p>
      </div>
      <div className="content">
        <p>
          Please write up everything that comes to your mind to explain and
          describe your business idea so we can match the perfect location for
          your business
        </p>
        <div className="textarea-container">
          <textarea
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            placeholder="Write here your dream as best as you can..."
            rows={10}
            cols={50}
          />
        </div>
        <button className="button-next" onClick={handleNext} disabled={loading}>
          {loading ? "Loading..." : buttonText}
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default AIRecommendations;
