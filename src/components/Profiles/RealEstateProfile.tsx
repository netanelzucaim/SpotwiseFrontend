import React, { useEffect, useState } from "react";
import userService from "../../services/user_service";
import RealEstateService from '../../services/realestate-service';
import "./../../styles/RealEstateProfile.css";

const RealEstateProfile: React.FC = () => {
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [ownerId, setOwnerId] = useState(localStorage.getItem("userId") || "");
  const [ownerName, setOwnerName] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        if (ownerId) {
          const user = await userService.getUser(ownerId);
          setOwnerName(user.fullName || user.username || "Unknown User");
        }
      } catch (error) {
        console.error("Failed to fetch user name", error);
      }
    };

    fetchOwner();
  }, [ownerId]);

  const handleSubmit = async () => {
    try {
      await RealEstateService.create({
        city,
        address,
        area,
        location,
        description,
        owner: ownerId,
      });

      setMessage("Real estate profile created successfully!");
    } catch (error) {
      setMessage("Failed to create real estate profile. Try again.");
    }
  };

  return (
    <div className="realestate-profile-wrapper">
      <div className="glass-form">
        <h1 className="headline">List your property & Turn dreams into addresses 🏡</h1>

        <input
          className="realestate-input"
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          className="realestate-input"
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          className="realestate-input"
          type="text"
          placeholder="Area (e.g. 120 sqm)"
          value={area}
          onChange={(e) => setArea(e.target.value)}
        />

        <input
          className="realestate-input"
          type="text"
          placeholder="Location Link (e.g. Google Maps URL)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <input
          className="realestate-input"
          type="text"
          value={ownerName}
          disabled
        />

        <textarea
          className="realestate-input description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="realestate-button" onClick={handleSubmit}>
          Publish Property
        </button>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default RealEstateProfile;
