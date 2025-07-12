import { styled } from "@mui/system";
import { Box, Button, Paper } from "@mui/material";
import { UploadFile } from "@mui/icons-material";

export const ProfileWrapper = styled(Box)({
   display: "flex",
  flexDirection: "column", // כדי שהתוכן יהיה אנכי
  alignItems: "center",    // אם אתה עדיין רוצה מרכז אופקי
  padding: "2rem",
  fontFamily: 'Montserrat, sans-serif'
});

export const GlassForm = styled(Paper)({
  background: "rgba(255, 255, 255, 0.08)",
  backdropFilter: "blur(12px)",
  borderRadius: "30px",
  padding: "2rem 3rem",
  maxWidth: "420px",
  width: "100%",
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
  '&:hover': {
    backgroundColor: "#00d1f5",
  },
});

export const StyledUploadFileIcon = styled(UploadFile)({
  cursor: "pointer",
});
