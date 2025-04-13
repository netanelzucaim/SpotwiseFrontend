import React, { useEffect, useState } from "react";
import { TextField, Typography, IconButton } from "@mui/material";
import { uploadPhoto } from "../../services/file-service";
import BusinessService from "../../services/business_service";
import userService from "../../services/user_service";
import { ProfileWrapper, GlassForm, StyledButton, StyledUploadFileIcon } from "../../styles/ProfilePageStyle"; 
import { useNavigate } from "react-router-dom";

const BusinessProfile: React.FC = () => {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoName, setLogoName] = useState("Choose a file");
  const [siteUrl, setSiteUrl] = useState("");
  const [ownerId, setOwnerId] = useState(localStorage.getItem("userId") || "");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        if (ownerId) {
          await userService.getUser(ownerId);
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
      setLogoName(file.name);
    }
  };

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name) newErrors.name = "Business Name is required";
    if (!logo) newErrors.logo = "Logo is required";
    if (!siteUrl) newErrors.siteUrl = "Website URL is required";
    if (!category) newErrors.category = "Category is required";
    if (!description) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateFields()) return;
    try {
      let logoUrl = "";
      if (logo) {
        logoUrl = await uploadPhoto(logo);
      }
      await BusinessService.create({ name, logo: logoUrl, owner: ownerId, siteUrl, category, description });
      setMessage("Business created successfully!");
      navigate("/home");
    } catch (error) {
      setMessage("Failed to create business. Try again.");
    }
  };

  return (
    <ProfileWrapper>
      <GlassForm elevation={3}>
        <Typography sx={{ fontFamily: 'Montserrat, sans-serif', textAlign: 'center', fontWeight: 'bold' }}>
          Create your business profile & Make your dream come true⚡
        </Typography>
        <TextField fullWidth label="Business Name" variant="outlined" margin="normal" value={name} onChange={(e) => setName(e.target.value)} error={!!errors.name} helperText={errors.name} />
        <TextField 
          fullWidth 
          label="Logo" 
          variant="outlined" 
          margin="normal" 
          value={logoName} 
          InputProps={{
            readOnly: true,
            endAdornment: (
              <label htmlFor="logo-upload">
                <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: "none" }} id="logo-upload" />
                <IconButton component="span">
                  <StyledUploadFileIcon />
                </IconButton>
              </label>
            ),
          }}
          error={!!errors.logo} 
          helperText={errors.logo} 
        />
        <TextField fullWidth label="Website URL" variant="outlined" margin="normal" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)} error={!!errors.siteUrl} helperText={errors.siteUrl} />
        <TextField fullWidth label="Category" variant="outlined" margin="normal" value={category} onChange={(e) => setCategory(e.target.value)} error={!!errors.category} helperText={errors.category} />
        <TextField fullWidth label="Description" variant="outlined" margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} error={!!errors.description} helperText={errors.description} />
        <StyledButton onClick={handleSubmit}>Create My Business</StyledButton>
        {message && <Typography color="success.main" sx={{ mt: 2 }}>{message}</Typography>}
      </GlassForm>
    </ProfileWrapper>
  );
};

export default BusinessProfile;
