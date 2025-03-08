import React, { useState } from 'react';
import RealEstateService from '../services/realestate-service';
import GeminiService from '../services/gemini-service';
import './../styles/AIRecommendations.css';

interface RealEstate {
  city: string;
  address: string;
  owner: string;
  description: string;
  area: string;
  location: string;
  _id: string;
}

const AiRecommendations: React.FC = () => {
  const [dream, setDream] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async () => {
    setLoading(true);
    setError(null);

    try {
      const allRealEstate: RealEstate[] = await RealEstateService.getAll();
      const response = await GeminiService.analyzeDream(dream, allRealEstate);

      if (!response) {
        setError('Could not get recommendations from AI.');
        setLoading(false);
        return;
      }
      setDream(response);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
      console.error('Error:', err);
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
        <p>Please write up everything that comes to your mind to explain and describe your business idea so we can match the perfect location for your business</p>
        <div className="textarea-container">
          <textarea
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            placeholder="Write here your dream as best as you can..."
            rows={10}
            cols={50}
          />
        </div>
        <button onClick={handleNext} disabled={loading}>
          {loading ? 'Loading...' : 'Next'}
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default AiRecommendations;