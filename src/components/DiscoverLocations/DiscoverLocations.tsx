import React, { useEffect, useState } from "react";
import RealEstateService from "../../services/realestate-service";
import { RealEstate } from "../../services/realestate-service";
import RealEstateModal from "./RealEstateModal";
import "../../styles/DiscoverLocations.css";

const DiscoverLocations: React.FC = () => {
  const [realEstates, setRealEstates] = useState<RealEstate[]>([]);
  const [selectedRealEstate, setSelectedRealEstate] = useState<RealEstate | null>(null);

  useEffect(() => {
    const fetchRealEstates = async () => {
      try {
        const data = await RealEstateService.getAll();
        setRealEstates(data);
      } catch (error) {
        console.error("Error fetching real estates:", error);
      }
    };

    fetchRealEstates();
  }, []);

  const handleCardClick = (realEstate: RealEstate) => {
    setSelectedRealEstate(realEstate);
  };

  const closeModal = () => {
    setSelectedRealEstate(null);
  };

  return (
    <div className="discover-locations-container">
      <div className="header">
        <h1>Discover Locations</h1>
        <p>Your Vision, The Perfect Location.</p>
      </div>
      <div className="real-estate-grid">
        {realEstates.map((realEstate) => (
          <div
            key={realEstate._id}
            className="real-estate-card"
            onClick={() => handleCardClick(realEstate)}
          >
            <h3>{realEstate.city}</h3>
            <p>{realEstate.address}</p>
          </div>
        ))}
      </div>
      {selectedRealEstate && (
        <RealEstateModal
          realEstate={selectedRealEstate}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default DiscoverLocations;