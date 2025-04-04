import { useRef, useState } from "react";
import { IUser, login, googleSignin } from "../../services/user_service"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./../../styles/LoginForm.css";

const LoginForm = () => {
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const onLoginUser = async () => {
      setError(null);
      if (usernameInputRef.current?.value && passwordInputRef.current?.value) {
          const user: IUser = {
              username: usernameInputRef.current?.value,
              password: passwordInputRef.current?.value
          };
          try {
              await login({ username: user.username!, password: user.password! });
              navigate("/home");
          } catch (err: any) {
              setError('Failed to login user - ' + err);
          }
      } else {
          setError("Please enter both username and password.");
      }
  };

  const onGoogleLoginSuccess = async (credentialResponse: CredentialResponse) => {
      setError(null);
      try {
          await googleSignin(credentialResponse);
          navigate("/posts");
      } catch (err: any) {
          setError(err.message || "Google login failed. Please try again.");
      }
  };

  const onGoogleLoginFailure = () => {
      setError("Google login failed. Please try again.");
  };

  return (
    <div className="login-container">
      <div className="login-box">
          <h1 className="title">SpotWise</h1>
          <p className="subtitle">Your Vision, The Perfect Location.</p>
          <p className="instruction">Sign in & Continue your journey</p>
          <input 
            ref={usernameInputRef} 
            type="text" 
            placeholder="Username" 
            className="input-field"
            required />
          <br />
          <input 
            ref={passwordInputRef} 
            type="password" 
            placeholder="Password" 
            className="input-field" 
            required />
          <button onClick={onLoginUser} className="signin-button">Sign in</button>
          <div className="google-login-container">
              <GoogleLogin onSuccess={onGoogleLoginSuccess} onError={onGoogleLoginFailure} locale="en" />
          </div>
          {error && <p className="error-message">{error}</p>}                
          <p className="signup-text">Don't have an account? <a href="/signup" className="signup-link">Sign Up</a></p>
      </div>
    </div>
  );
};

export default LoginForm;