import { styled } from "@mui/system";
import { Box, Button, Paper } from "@mui/material";
import { UploadFile } from "@mui/icons-material";

export const ProfileWrapper = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "2rem",
});

export const GlassForm = styled(Paper)({
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
  borderRadius: "30px",
  padding: "2rem 3rem",
  maxWidth: "420px",
  width: "100%",
  boxShadow: "0 0 30px rgba(0, 225, 255, 0.25)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const StyledButton = styled(Button)({
  width: "100%",
  marginTop: "1rem",
  padding: "0.8rem",
  backgroundColor: "#00e5ff",
  color: "#000",
  fontWeight: 600,
  fontSize: "1.1rem",
  borderRadius: "30px",
  boxShadow: "0 0 10px rgba(0, 229, 255, 0.5)",
  '&:hover': {
    backgroundColor: "#00d1f5",
  },
});

export const StyledUploadFileIcon = styled(UploadFile)({
  cursor: "pointer",
});
