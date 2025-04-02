import { useState, useRef, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { register, IUser } from "../../services/user_service";
import { uploadPhoto } from "../../services/file-service";
import { TextField, Button, Avatar, Typography, Box } from "@mui/material";
import "./../../styles/Signup.css";
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

    try {
      const url = imgSrc ? await uploadPhoto(imgSrc) : "";
      setImgUrl(url);
      const user: IUser = {
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        imgUrl: url,
        phoneNumber: formData.phoneNumber,
      };
      const response = await register(user);

      if (response.status === 201) {
        setSuccess("Registration successful! You can now sign in.");
        setError(null);
        setFormData({ username: "", fullName: "", email: "", phoneNumber: "", password: "", confirmPassword: "" });
        setImgSrc(null);
        setImgUrl("");
        navigate("/ai-recommendations");
      } else {
        setError(response.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="signup-div">
      <Typography variant="h5">Sign up & Start your journey</Typography>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-rows">
          <div className="d-flex justify-content-center position-relative">
            <Avatar
              src={imgSrc ? URL.createObjectURL(imgSrc) : logo}
              sx={{ height: 100, width: 100, cursor: "pointer" }}
              onClick={selectImg}
            />
            <input style={{ display: "none" }} ref={fileInputRef} type="file" onChange={imgSelected}></input>
          </div>
        </div>
        <div className="form-rows spaced">
          <TextField fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} required sx={{ background: "white" }} />
          <TextField fullWidth label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} sx={{ background: "white" }} />
        </div>
        <div className="form-rows spaced">
          <TextField fullWidth label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required error={!!errors.email} helperText={errors.email} sx={{ background: "white" }} />
          <TextField fullWidth label="Phone Number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} sx={{ background: "white" }} />
        </div>
        <div className="form-rows spaced">
          <TextField fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required error={!!errors.password} helperText={errors.password} sx={{ background: "white" }} />
          <TextField fullWidth label="Confirm Password" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required error={!!errors.confirmPassword} helperText={errors.confirmPassword} sx={{ background: "white" }} />
        </div>
        <Button type="submit" variant="contained" className="signup-button">Sign up</Button>
      </form>
      <div className="error-messages">
        {errors.imgSrc && <Typography color="error">{errors.imgSrc}</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        {success && <Typography color="success.main">{success}</Typography>}
      </div>
    </div>
  );
};

export default SignupForm;