import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { RealEstate } from "../../services/realestate-service";
import { useNavigate } from "react-router-dom";


interface RealEstateWithUser extends RealEstate {
  userFullName?: string; 
}

interface RealEstateModalProps {
  realEstate: RealEstateWithUser;
  index: number;
  onClose: () => void;
}

const RealEstateModal: React.FC<RealEstateModalProps> = ({ realEstate, index, onClose }) => {
  const navigate = useNavigate();

  const handleDiscoverLocation = () => {
    navigate("/map", {
      state: {
        index,
      },
    });
  };
  
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1300,
      }}
    >
      <Card
        sx={{
          width: "90%",
          maxWidth: 500,
          borderRadius: "1rem",
          backgroundColor: "#D0CBBC",
          boxShadow: 6,
          overflow: "hidden",
        }}
      >
        <CardMedia
          component="div"
          sx={{
            height: 200,
            backgroundImage:`url("https://images.seeklogo.com/logo-png/26/1/new-google-maps-icon-logo-png_seeklogo-268336.png")`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          {/* Button Overlay */}
  <Box
    sx={{
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.32)", 
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "#fff", 
      fontWeight: "bold",
      fontSize: "1.9rem",
      padding: "10px 20px",
      borderRadius: "8px", 
      cursor: "pointer",
      textAlign: "center",
      transition: "background-color 0.3s ease",
      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.8)", 
      },
    }}
    onClick={() => handleDiscoverLocation()} 
  >
    Discover This Location
  </Box>
</CardMedia>
          
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            {realEstate.city}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            <strong>Address:</strong> {realEstate.address}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            <strong>Owner:</strong> {realEstate.userFullName}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            <strong>Description:</strong> {realEstate.description}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            <strong>Area:</strong> {realEstate.area}
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
            wordWrap: "break-word", 
            overflowWrap: "break-word",
  }}
>
  <strong>Location:</strong> {realEstate.location}
</Typography>
        </CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "1rem",
            gap: "1rem",
          }}
        >
          <Button variant="contained" color="primary" onClick={onClose}>
            Close
          </Button>
        </Box>
      </Card>
    </Box>
  );
};

export default RealEstateModal;