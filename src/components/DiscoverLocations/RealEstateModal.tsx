import React from "react";
import { RealEstate } from "../../services/realestate-service";
import "../../styles/RealEstateModal.css"; // Import the CSS file

interface RealEstateModalProps {
  realEstate: RealEstate;
  onClose: () => void;
}

const RealEstateModal: React.FC<RealEstateModalProps> = ({ realEstate, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{realEstate.city}</h2>
        <p><strong>Address:</strong> {realEstate.address}</p>
        <p><strong>Owner:</strong> {realEstate.owner}</p>
        <p><strong>Description:</strong> {realEstate.description}</p>
        <p><strong>Area:</strong> {realEstate.area}</p>
        <p><strong>Location:</strong> {realEstate.location}</p>
      </div>
    </div>
  );
};

export default RealEstateModal;