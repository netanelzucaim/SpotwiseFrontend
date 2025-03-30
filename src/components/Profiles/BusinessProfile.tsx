import React, { useEffect, useState } from "react";
import { uploadPhoto } from "../../services/file-service";
import BusinessService from "../../services/business_service";
import userService from "../../services/user_service";
import "./../../styles/BusinessProfile.css";

const BusinessProfile: React.FC = () => {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [siteUrl, setSiteUrl] = useState("");
  const [ownerId, setOwnerId] = useState(localStorage.getItem("userId") || "");
  const [ownerName, setOwnerName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
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

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      let logoUrl = "";
      if (logo) {
        logoUrl = await uploadPhoto(logo);
      }

      await BusinessService.create({
        name,
        logo: logoUrl,
        owner: ownerId,
        siteUrl,
        category,
        description,
      });

      setMessage("Business created successfully!");
    } catch (error) {
      setMessage("Failed to create business. Try again.");
    }
  };

  return (
    <div className="business-profile-wrapper">
      <div className="glass-form">
        <h1 className="headline">Create your business profile & Make your dream come true ⚡</h1>

        <input
          className="business-input"
          type="text"
          placeholder="Business Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label className="input-label">Logo</label>
        <input
            className="business-input"
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
        />
        {preview && (
            <img src={preview} alt="Logo" className="logo-preview" />
        )}

        <input
          className="business-input"
          type="text"
          placeholder="URL to my site"
          value={siteUrl}
          onChange={(e) => setSiteUrl(e.target.value)}
        />

        <input
          className="business-input"
          type="text"
          value={ownerName}
          disabled
        />

        <input
          className="business-input"
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <textarea
          className="business-input description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <button className="business-button" onClick={handleSubmit}>
          Create My Business
        </button>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default BusinessProfile;
