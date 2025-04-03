import { useRef, useState } from "react";
import { IUser, login, googleSignin } from "../../services/user_service"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./../../styles/LoginForm.css";

const LoginForm = () => {
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const onLoginUser = async () => {
      setError(null);
      if (emailInputRef.current?.value && passwordInputRef.current?.value) {
        console.log(emailInputRef, passwordInputRef)
          const user: IUser = {
              email: emailInputRef.current?.value,
              password: passwordInputRef.current?.value
          };
          try {
              await login({ username: user.username!, password: user.password! });
              navigate("/posts");
          } catch (err: any) {
              setError(err.message || "Login failed. Please try again.");
          }
      } else {
          setError("Please enter both email and password.");
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
          <input ref={emailInputRef} type="text" placeholder="Email" className="input-field" />
          <br />
          <input ref={passwordInputRef} type="password" placeholder="Password" className="input-field" />
          <button className="signin-button" onClick={onLoginUser}>Sign in</button>
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