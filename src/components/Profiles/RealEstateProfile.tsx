import React, { useEffect, useState } from "react";
import userService from "../../services/user_service";
import RealEstateService, { RealEstate } from "../../services/realestate-service";
import MapService from "../../services/map-service";
import {
  ProfileWrapper,
  GlassForm,
  StyledButton,
} from "../../styles/ProfilePageStyle";
import { TextField, Typography, Autocomplete } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../../styles/ProfilePages.css";
import { BrandHeading } from "../Logo/Logo";

const RealEstateProfile: React.FC = () => {
  const [profile, setProfile] = useState<RealEstate | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [ownerId] = useState(localStorage.getItem("userId") || "");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [addressOptions, setAddressOptions] = useState<AddressSuggestion[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<AddressSuggestion | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const owner = localStorage.getItem("userId");
        const realestates = await RealEstateService.getAll();
        const existing = realestates.find((re) => re.owner === owner);
        if (existing) {
          setProfile(existing);
          setCity(existing.city);
          setAddress(existing.address);
          setArea(existing.area);
          setDescription(existing.description);
          setPrice(existing.price.toString());
          setSelectedAddress({ label: existing.address });
        }
      } catch (error) {
        console.error("No existing real estate profile found.");
      }
    };

    fetchProfile();
  }, []);

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!city.trim()) newErrors.city = "City is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!area.trim()) newErrors.area = "Area is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!price) newErrors.price = "Price is required";
    else if (+price <= 0) newErrors.price = "Price must be a positive number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    const realEstateData: RealEstate = {
      city,
      address: selectedAddress?.label || address,
      area,
      description,
      price: parseFloat(price),
      owner: ownerId,
    };

    try {
      if (profile) {
        await RealEstateService.update(profile._id!, realEstateData);
        setMessage("Profile updated successfully!");
        setEditMode(false);
      } else {
        await RealEstateService.create(realEstateData);
        setMessage("Profile created successfully!");
        navigate("/home");
      }
    } catch (error) {
      setMessage("Failed to save real estate profile.");
    }
  };

  const handleAddressSearch = async (input: string) => {
    setAddress(input);
    if (input.length >= 3) {
      const suggestions = await MapService.getAddressSuggestions(input);
      setAddressOptions(suggestions);
    }
  };

  return (
    <div>
      <BrandHeading></BrandHeading>
    <ProfileWrapper>
      <GlassForm elevation={3}>
        <Typography variant="h5" class="profile-title">
          {profile ? "Edit your real estate profile" : "Create your real estate profile & Make your dream come true⚡"}
        </Typography>

        <TextField fullWidth label="City" variant="outlined" margin="normal"
          value={city} onChange={(e) => setCity(e.target.value)}
          error={!!errors.city} helperText={errors.city} disabled={!editMode && profile !== null} />

        <Autocomplete fullWidth options={addressOptions} getOptionLabel={(option) => option.label}
          filterOptions={(x) => x}
          onInputChange={(_, value) => handleAddressSearch(value)}
          onChange={(_, value) => {
            setSelectedAddress(value);
            setAddress(value?.label || "");
          }}
          value={selectedAddress}
          renderInput={(params) => (
            <TextField {...params} fullWidth label="Address" variant="outlined" margin="normal"
              error={!!errors.address} helperText={errors.address} disabled={!editMode && profile !== null} />
          )}
        />

        <TextField fullWidth label="Area (in sqm)" type="number" variant="outlined" margin="normal"
          value={area} onChange={(e) => setArea(e.target.value)}
          error={!!errors.area} helperText={errors.area} disabled={!editMode && profile !== null} />

        <TextField fullWidth label="Description" variant="outlined" margin="normal"
          value={description} onChange={(e) => setDescription(e.target.value)}
          error={!!errors.description} helperText={errors.description} disabled={!editMode && profile !== null} />

        <TextField fullWidth label="Price" type="number" variant="outlined" margin="normal"
          value={price} onChange={(e) => setPrice(e.target.value)}
          error={!!errors.price} helperText={errors.price}
          InputProps={{ endAdornment: <Typography sx={{ ml: 1 }}>ILS</Typography> }}
          disabled={!editMode && profile !== null} />

        <StyledButton onClick={() => profile && !editMode ? setEditMode(true) : handleSave()}>
          {profile && !editMode ? "Edit" : "Save"}
        </StyledButton>

        {message && (
          <Typography sx={{ color: "green", marginTop: "1rem" }}>{message}</Typography>
        )}
      </GlassForm>
    </ProfileWrapper>
    </div>
  );
};

export default RealEstateProfile;
