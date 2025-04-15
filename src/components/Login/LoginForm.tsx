import { useRef, useState } from "react";
import {
  IUser,
  login,
  googleSignin,
  getUser,
  updateUser,
} from "../../services/user_service";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "./../../styles/LoginForm.css";
import { GlassForm, StyledButton } from "../../styles/ProfilePageStyle";
import {
  Box,
  Link,
  Stack,
  TextField,
  Typography,
  Modal,
  Button,
} from "@mui/material";

const LoginForm = () => {
  const usernameInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<string | null>(null);

  const onLoginUser = async () => {
    setError(null);
    if (usernameInputRef.current?.value && passwordInputRef.current?.value) {
      const user: IUser = {
        username: usernameInputRef.current?.value,
        password: usernameInputRef.current?.value,
      };
      try {
        await login({ username: user.username!, password: user.password! });
        navigate("/home");
      } catch (err: any) {
        setError("Failed to login user - " + err);
      }
    } else {
      setError("Please enter both username and password.");
    }
  };

  const onGoogleLoginSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    setError(null);
    try {
      await googleSignin(credentialResponse);

      const userId = localStorage.getItem("userId");
      if (userId) {
        const user = await getUser(userId); // Fetch user data
        console.log("user mode is", user.mode);
        if (user.mode == "none") {
          setModalOpen(true); // Open the modal if mode is not set
        } else {
          navigate("/home"); // Navigate directly if mode is already set
        }
      } else {
        setError("User ID not found. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Google login failed. Please try again.");
    }
  };

  const onGoogleLoginFailure = () => {
    setError("Google login failed. Please try again.");
  };

  const handleModeSelection = async (selectedMode: string) => {
    setMode(selectedMode);
    setModalOpen(false); // Close the modal

    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        await updateUser(userId, { mode: selectedMode }); // Update the user's mode
        localStorage.setItem("mode", selectedMode); // Save the mode locally
        navigate("/home"); // Navigate to home after selection
      } catch (err) {
        setError("Failed to update user mode. Please try again.");
        console.error("Error updating user mode:", err);
      }
    } else {
      setError("User ID not found. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <Box>
        <GlassForm elevation={4} sx={{ padding: 4, mt: 8, borderRadius: 4 }}>
          <Stack spacing={2} alignItems="center">
            <Typography
              variant="h3"
              fontWeight="bold"
              color="text.secondary"
              fontFamily={"Montserrat"}
            >
              SpotWise
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              fontFamily={"Montserrat"}
              fontWeight="bold"
            >
              Your Vision, The Perfect Location.
            </Typography>
          </Stack>
          <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
            <TextField
              inputRef={usernameInputRef}
              label="Username"
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "30px",
                  backgroundColor: "white",
                },
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
                "& .MuiOutlinedInput-root": {
                  borderRadius: "30px",
                  backgroundColor: "white",
                },
              }}
              fullWidth
              required
            />
            <StyledButton type="submit" onClick={onLoginUser}>
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
              <Typography
                color="error"
                variant="body2"
                fontFamily={"Montserrat"}
              >
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
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 2 }}
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
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};

export default LoginForm;
