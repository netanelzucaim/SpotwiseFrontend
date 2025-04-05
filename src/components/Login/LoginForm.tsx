import { useRef, useState } from "react";
import { IUser, login, googleSignin } from "../../services/user_service"
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "./../../styles/LoginForm.css";
import { GlassForm, StyledButton } from "../../styles/ProfilePageStyle";
import { Box, Link, Stack, TextField, Typography } from "@mui/material";

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
  <Box>
    <GlassForm elevation={4} sx={{ padding: 4, mt: 8, borderRadius: 4 }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h3" fontWeight="bold" color="text.secondary" fontFamily={"Montserrat"}>
          SpotWise
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" fontFamily={"Montserrat"} fontWeight="bold">
          Your Vision, The Perfect Location.
        </Typography>
      </Stack>
      <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
        <TextField
          inputRef={usernameInputRef}
          label="Username"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '30px',
              backgroundColor: 'white'
            }
          }}
          fullWidth
          required
        />
        <TextField
          inputRef={passwordInputRef}
          label="Password"
          type="password"
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '30px',
              backgroundColor: 'white'
            }
          }}
          fullWidth
          required
        />
        <StyledButton 
          type="submit"
          onClick={onLoginUser}
        >
          Sign In
        </StyledButton>

        <Box sx={{ mt: 2 }}>
          <GoogleLogin
            onSuccess={onGoogleLoginSuccess}
            onError={onGoogleLoginFailure}
            locale="en"
          />
        </Box>

        {error && (
          <Typography color="error" variant="body2" fontFamily={"Montserrat"}>
              {error}
          </Typography>
        )}

        <Typography variant="body2" fontFamily={"Montserrat"}>
          Don't have an account?{" "}
          <Link href="/signup" underline="hover">
            Sign Up
          </Link>
        </Typography>
      </Stack>
    </GlassForm>
  </Box>
  );
};

export default LoginForm;