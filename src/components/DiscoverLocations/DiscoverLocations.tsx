import React, { useEffect, useState } from "react";
import RealEstateService from "../../services/realestate-service";
import { RealEstate } from "../../services/realestate-service";
import RealEstateModal from "../Realestate/RealEstate";
import UserService from "../../services/user_service";
import "../../styles/DiscoverLocations.css";
import { BrandHeading } from "../Logo/Logo";


interface RealEstateWithUser extends RealEstate {
  userFullName?: string; 
}

const DiscoverLocations: React.FC = () => {
    const [realEstates, setRealEstates] = useState<RealEstateWithUser[]>([]);
    const [visibleCount, setVisibleCount] = useState(6); 
    const [selectedRealEstate, setSelectedRealEstate] = useState<RealEstateWithUser | null>(null);
    const [filteredRealEstates, setFilteredRealEstates] = useState<RealEstateWithUser[]>([]);
    const [filterText, setFilterText] = useState(""); 


  
    useEffect(() => {
      const fetchRealEstates = async () => {
        try {
          const data = await RealEstateService.getAll();
      
          const realEstatesWithUserNames = await Promise.all(
            data.map(async (realEstate) => {
              const user = await UserService.getUser(realEstate.owner); 
              return {
                ...realEstate,
                userFullName: user.fullName, 
              };
            })
          );
      
          setRealEstates(realEstatesWithUserNames);
          setFilteredRealEstates(realEstatesWithUserNames); 
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
        setVisibleCount((prevCount) => prevCount + 6); 
      };

      const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setFilterText(value);
        setFilteredRealEstates(
          realEstates.filter(
            (realEstate) =>
              realEstate.city.toLowerCase().includes(value) ||
              realEstate.address.toLowerCase().includes(value) ||
              realEstate.userFullName?.toLowerCase().includes(value) ||
              realEstate.description.toLowerCase().includes(value) ||
              realEstate.area.toLowerCase().includes(value)
          )
        );
      };
  
    return (
      <div>
        <BrandHeading></BrandHeading>
        <div className="discover-locations-container">
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
              index={realEstates.findIndex((re) => re._id === selectedRealEstate._id)}
              onClose={closeModal}
            />
          )}
        </div>
      </div>
    );
  };
  
  export default DiscoverLocations;