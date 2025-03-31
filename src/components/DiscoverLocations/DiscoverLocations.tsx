import React, { useEffect, useState } from "react";
import RealEstateService from "../../services/realestate-service";
import { RealEstate } from "../../services/realestate-service";
import RealEstateModal from "./RealEstateModal";
import "../../styles/DiscoverLocations.css";

const DiscoverLocations: React.FC = () => {
    const [realEstates, setRealEstates] = useState<RealEstate[]>([]);
    const [visibleCount, setVisibleCount] = useState(6); // Number of cards to show initially
    const [selectedRealEstate, setSelectedRealEstate] = useState<RealEstate | null>(null);
    const [filteredRealEstates, setFilteredRealEstates] = useState<RealEstate[]>([]);
    const [filterText, setFilterText] = useState(""); // State for the filter input


  
    useEffect(() => {
      const fetchRealEstates = async () => {
        try {
          const data = await RealEstateService.getAll();
          setRealEstates(data);
          setFilteredRealEstates(data); // Initialize filtered list
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

    const showMoreCards = () => {
        setVisibleCount((prevCount) => prevCount + 6); // Show 6 more cards on each click
      };

      const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setFilterText(value);
        setFilteredRealEstates(
          realEstates.filter(
            (realEstate) =>
              realEstate.city.toLowerCase().includes(value) ||
              realEstate.address.toLowerCase().includes(value) ||
              realEstate.description.toLowerCase().includes(value) ||
              realEstate.area.toLowerCase().includes(value) ||
              realEstate.location.toLowerCase().includes(value)
          )
        );
      };
  
    return (
      <div className="discover-locations-container">
        <div className="header">
          <h1>SpotWise</h1>
          <p>Your Vision, The Perfect Location.</p>
        </div>
        <div className="real-estate-container">
        <h2 className="container-title">Discover Locations</h2> {/* Add title here */}
        <input
          type="text"
          className="filter-textbox"
          placeholder="Filter by city, address, description, etc."
          value={filterText}
          onChange={handleFilterChange}
        />
          <div className="real-estate-grid">
            {filteredRealEstates.slice(0, visibleCount).map((realEstate) => (
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
          {visibleCount < filteredRealEstates.length && (
          <button className="show-more-button" onClick={showMoreCards}>
            Show Me More
          </button>
        )}
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