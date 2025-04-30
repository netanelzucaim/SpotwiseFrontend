import React, { useEffect, useState } from "react";
import userService from "../../services/user_service";
import RealEstateService from "../../services/realestate-service";
import MapService from "../../services/map-service";
import {
  ProfileWrapper,
  GlassForm,
  StyledButton,
} from "../../styles/ProfilePageStyle";
import { TextField, Typography, Autocomplete } from "@mui/material";
import { useNavigate } from "react-router-dom";

const RealEstateProfile: React.FC = () => {
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [ownerId, setOwnerId] = useState(localStorage.getItem("userId") || "");
  const [ownerName, setOwnerName] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [addressOptions, setAddressOptions] = useState<AddressSuggestion[]>([]);
  const [selectedAddress, setSelectedAddress] =
    useState<AddressSuggestion | null>(null);

  const navigate = useNavigate();

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

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!city.trim()) newErrors.city = "City is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!area.trim()) newErrors.area = "Area is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!price) newErrors.price = "Price is required";
    if (price <= 0) newErrors.price = "Price must be positive number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;

    try {
      await RealEstateService.create({
        city,
        address: selectedAddress?.label || "",
        area,
        description,
        price,
        owner: ownerId,
      });

      setMessage("Real estate profile created successfully!");
      navigate("/home");
    } catch (error) {
      setMessage("Failed to create real estate profile. Try again.");
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
    <ProfileWrapper>
      <GlassForm elevation={3}>
        <Typography variant="h5" sx={{ color: "#fff", textAlign: "center" }}>
          Create your real estate profile & Make your dream come true⚡
        </Typography>

        <TextField
          fullWidth
          label="City"
          variant="outlined"
          margin="normal"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          error={!!errors.city}
          helperText={errors.city}
        />

        <Autocomplete
          fullWidth
          options={addressOptions}
          getOptionLabel={(option) => option.label}
          filterOptions={(x) => x}
          onInputChange={(_, value) => handleAddressSearch(value)}
          onChange={(_, value) => {
            setSelectedAddress(value);
            setAddress(value?.label || "");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label="Address"
              variant="outlined"
              margin="normal"
              error={!!errors.address}
              helperText={errors.address}
            />
          )}
        />

        <TextField
          fullWidth
          label="Area (e.g. 120 sqm)"
          variant="outlined"
          margin="normal"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          error={!!errors.area}
          helperText={errors.area}
        />

        <TextField
          fullWidth
          label="Description"
          variant="outlined"
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
        />

        <TextField
          fullWidth
          label="Price"
          variant="outlined"
          margin="normal"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          error={!!errors.price}
          helperText={errors.price}
          InputProps={{
            endAdornment: <Typography sx={{ marginLeft: "8px" }}>ILS</Typography>,
          }}
        />

        <StyledButton onClick={handleSubmit}>Publish Property</StyledButton>

        {message && (
          <Typography sx={{ color: "green", marginTop: "1rem" }}>
            {message}
          </Typography>
        )}
      </GlassForm>
    </ProfileWrapper>
  );
};

export default RealEstateProfile;
