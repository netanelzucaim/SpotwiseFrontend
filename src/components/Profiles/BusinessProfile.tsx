import React, { useEffect, useState } from "react";
import { TextField, Typography, IconButton } from "@mui/material";
import { uploadPhoto } from "../../services/file-service";
import BusinessService, { Business } from "../../services/business_service";
import { ProfileWrapper, GlassForm, StyledButton, StyledUploadFileIcon } from "../../styles/ProfilePageStyle"; 
import { useNavigate } from "react-router-dom";

const BusinessProfile: React.FC = () => {
  const [profile, setProfile] = useState<Business | null>(null);
  const [editMode, setEditMode] = useState(false);

  const [name, setName] = useState("");
  const [logo, setLogo] = useState<File | null>(null);
  const [logoName, setLogoName] = useState("Choose a file");
  const [siteUrl, setSiteUrl] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [ownerId, setOwnerId] = useState(localStorage.getItem("userId") || "");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const existing = await BusinessService.getCurrentUserBusiness();
        if (existing) {
          setProfile(existing);
          setName(existing.name);
          setSiteUrl(existing.siteUrl);
          setCategory(existing.category);
          setDescription(existing.description);
          setLogoName("Current Logo");
        }
      } catch (e) {
        console.log("No existing business found.");
      }
    };
    fetchProfile();
  }, []);

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
    if (!profile && !logo) newErrors.logo = "Logo is required";
    if (!siteUrl) newErrors.siteUrl = "Website URL is required";
    if (!category) newErrors.category = "Category is required";
    if (!description) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateFields()) return;

    try {
      let logoUrl = profile?.logo || "";
      if (logo) {
        logoUrl = await uploadPhoto(logo);
      }

      let businessData = {
        name,
        logo: logoUrl,
        owner: ownerId,
        siteUrl,
        category,
        description,
      };

      if (profile) {
        let id = (await BusinessService.getCurrentUserBusiness())._id || "";
        await BusinessService.update(businessData, id);
        setMessage("Business updated successfully!");
        setEditMode(false);
      } else {
        await BusinessService.create({ name, logo: logoUrl, owner: ownerId, siteUrl, category, description });
        setMessage("Business created successfully!");
        navigate("/home");
      }
    } catch (error) {
      setMessage("Failed to save business. Try again.");
    }
  };

  return (
    <ProfileWrapper>
      <GlassForm elevation={3}>
        <Typography variant="h5" sx={{ color: "#fff", textAlign: "center" }}>
          {profile ? "Edit your business profile" : "Create your business profile & Make your dream come true⚡"}
        </Typography>

        <TextField fullWidth label="Business Name" variant="outlined" margin="normal"
          value={name} onChange={(e) => setName(e.target.value)}
          error={!!errors.name} helperText={errors.name} disabled={!editMode && profile !== null} />

        <TextField fullWidth label="Logo" variant="outlined" margin="normal" value={logoName}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <label htmlFor="logo-upload">
                <input type="file" accept="image/*" onChange={handleLogoChange} style={{ display: "none" }} id="logo-upload" />
                <IconButton component="span" disabled={!editMode && profile !== null}>
                  <StyledUploadFileIcon />
                </IconButton>
              </label>
            ),
          }}
          error={!!errors.logo} helperText={errors.logo} disabled={!editMode && profile !== null} />

        <TextField fullWidth label="Website URL" variant="outlined" margin="normal"
          value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)}
          error={!!errors.siteUrl} helperText={errors.siteUrl} disabled={!editMode && profile !== null} />

        <TextField fullWidth label="Category" variant="outlined" margin="normal"
          value={category} onChange={(e) => setCategory(e.target.value)}
          error={!!errors.category} helperText={errors.category} disabled={!editMode && profile !== null} />

        <TextField fullWidth label="Description" variant="outlined" margin="normal"
          value={description} onChange={(e) => setDescription(e.target.value)}
          error={!!errors.description} helperText={errors.description} disabled={!editMode && profile !== null} />

        <StyledButton onClick={() => profile && !editMode ? setEditMode(true) : handleSave()}>
          {profile && !editMode ? "Edit" : "Save"}
        </StyledButton>

        {message && <Typography sx={{ color: "green", marginTop: "1rem" }}>{message}</Typography>}
      </GlassForm>
    </ProfileWrapper>
  );
};

export default BusinessProfile;
