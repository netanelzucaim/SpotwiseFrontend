import { useState, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { register, IUser } from "../../services/user_service";
import { uploadPhoto } from "../../services/file-service";
import {
  TextField,
  Avatar,
  Typography,
  Modal,
  Button,
  Box,
} from "@mui/material";
import {
  ProfileWrapper,
  GlassForm,
  StyledButton,
} from "../../styles/ProfilePageStyle";
import logo from "../../../public/logo.png";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    imgSrc: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imgSrc, setImgSrc] = useState<File | null>(null);
  const [imgUrl, setImgUrl] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMode, setSelectedMode] = useState<
    "Real Estate" | "Business" | null
  >(null);

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const imgSelected = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0]);
      setErrors({ ...errors, imgSrc: "" });
    }
  };

  const selectImg = (): void => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = { ...errors };

    if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
      hasErrors = true;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      hasErrors = true;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      hasErrors = true;
    }

    if (!imgSrc) {
      newErrors.imgSrc = "Please select a profile picture";
      hasErrors = true;
    }

    setErrors(newErrors);
    if (hasErrors) return;

    setModalOpen(true); // Open the modal for mode selection
  };

  const handleModeSelection = async (mode: "Real Estate" | "Business") => {
    setSelectedMode(mode);
    setModalOpen(false); // Close the modal

    try {
      const url = imgSrc ? await uploadPhoto(imgSrc) : "";
      setImgUrl(url);
      const user: IUser = {
        ...formData,
        imgUrl: url,
        mode, // Pass the selected mode
      };
      const response = await register(user);

      if (response.status === 201) {
        setSuccess("Registration successful! You can now sign in.");
        setError(null);
        navigate("/home");
      } else {
        setError(response.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <ProfileWrapper
      className="signup-div"
      style={{
        height: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <GlassForm elevation={3}>
        <Typography
          variant="h5"
          sx={{
            color: "#fff",
            textAlign: "center",
            textShadow: "0 0 10px rgba(255, 255, 255, 0.5)",
            marginBottom: "20px",
          }}
        >
          Sign up & Start your journey
        </Typography>

        <div className="form-rows" style={{ marginBottom: "30px" }}>
          <Avatar
            src={imgSrc ? URL.createObjectURL(imgSrc) : logo}
            sx={{
              height: 100,
              width: 100,
              cursor: "pointer",
              boxShadow: "0 0 15px rgba(0, 225, 255, 0.6)",
            }}
            onClick={selectImg}
          />
          <input
            style={{ display: "none" }}
            ref={fileInputRef}
            type="file"
            onChange={imgSelected}
          ></input>
        </div>

        <TextField
          fullWidth
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          sx={{ marginBottom: "20px" }}
        />
        <TextField
          fullWidth
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          sx={{ marginBottom: "20px" }}
        />

        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          error={!!errors.email}
          helperText={errors.email}
          sx={{ marginBottom: "20px" }}
        />
        <TextField
          fullWidth
          label="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          sx={{ marginBottom: "20px" }}
        />

        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
          error={!!errors.password}
          helperText={errors.password}
          sx={{ marginBottom: "20px" }}
        />
        <TextField
          fullWidth
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
          sx={{ marginBottom: "30px" }}
        />

        <StyledButton
          type="submit"
          onClick={handleSubmit}
          sx={{ marginBottom: "20px" }}
        >
          Sign up
        </StyledButton>

        <div className="error-messages">
          {errors.imgSrc && (
            <Typography color="error">{errors.imgSrc}</Typography>
          )}
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success.main">{success}</Typography>}
        </div>
      </GlassForm>

      {/* Modal for selecting mode */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="mode-selection-modal"
        aria-describedby="select-real-estate-or-business"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            textAlign: "center",
          }}
        >
          <Typography id="mode-selection-modal" variant="h6" component="h2">
            Select Your Mode
          </Typography>
          <Box
            sx={{ display: "flex", gap: 2, justifyContent: "center", mt: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleModeSelection("Real Estate")}
            >
              Real Estate
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleModeSelection("Business")}
            >
              Business
            </Button>
          </Box>
        </Box>
      </Modal>
    </ProfileWrapper>
  );
};

export default SignupForm;
