import { useNavigate } from "react-router-dom";
import { useState, useRef, ChangeEvent } from "react";
import { registerUser, IUser } from "./../../services/user-service";
import { uploadPhoto } from "./../../services/file-service";
import "./../../styles/signup.css";
import logo from '../../../public/logo.png';

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
    console.log(e.target.value);
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(e.target.files[0]);
      setErrors({ ...errors, imgSrc: "" });
    }
  };

  const selectImg = (): void => {
    console.log("Selecting image...");
    fileInputRef.current?.click();
  };

  const resetForm = (): void => {
    setFormData({
      username: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    });
    setImgSrc(null);
    setImgUrl("");
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

    if (hasErrors) {
      return;
    }

    try {
      const url = await uploadPhoto(imgSrc);
      setImgUrl(url);

      const user: IUser = {
        username: formData.username,
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        imgUrl: url,
        phoneNumber: formData.phoneNumber
      };
      const response = await registerUser(user);

      if (response.status === 200 && !hasErrors) {
        setSuccess(response.message || "Registration successful! You can now sign in.");
        setError(null);
        resetForm();
        navigate("/ai-recommendations");
      } else {
        setError(response.message || "Registration failed. Please try again.");
        setSuccess(null);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setError("Registration failed. Please try again.");
      setSuccess(null);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign up & Start your journey</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="form-row">
          <div className="d-flex justify-content-center position-relative">
            <img src={imgSrc ? URL.createObjectURL(imgSrc) : logo} style={{ height: "100px", width: "100px", cursor: "pointer" }} className="img-fluid" onClick={selectImg} />
            <input style={{ display: "none" }} ref={fileInputRef} type="file" onChange={imgSelected}></input>
          </div>
        </div>
        <div className="form-row spaced">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="form-row spaced">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-row spaced">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="signup-button">Sign up</button>
      </form>
      <div className="error-messages">
        {errors.email && <p className="error">{errors.email}</p>}
        {errors.password && <p className="error">{errors.password}</p>}
        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        {errors.imgSrc && <p className="error">{errors.imgSrc}</p>}
      </div>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <p className="signin-text">Already have an account? <a href="/login">Sign In</a></p>
    </div>
  );
};

export default SignupForm;