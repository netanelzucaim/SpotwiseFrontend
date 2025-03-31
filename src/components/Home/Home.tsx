import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";

const HomePage: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white flex flex-col items-center"
      style={{
        backgroundImage: "url('/utils/Spotwise_background.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      {/* Header */}
      <header className="relative w-full flex flex-col items-center text-center p-4 z-10">
        <h1 className="text-4xl font-bold text-green-400">SpotWise</h1>
        <p className="text-sm text-gray-200">
          Your Vision, The Perfect Location.
        </p>
        <nav className="flex gap-2 justify-center items-center mt-2">
          {navItems.map((item, index) => (
            <Button
              key={index}
              startIcon={<span>{item.icon}</span>}
              onClick={() =>
                navigate(item.label === "Login" ? "/login" : "/home")
              } // Use navigate for routing
              sx={{
                backgroundColor: "",
                "&:hover": { backgroundColor: "#588C87" },
                borderRadius: "20px",
                padding: "0.5rem 2rem", // Replaced px with rem
                color: "white",
                fontWeight: "bold",
                textTransform: "none",
              }}
            >
              {item.label}
            </Button>
          ))}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative text-center py-8 px-4 max-w-90% z-10">
        <h2 className="text-3xl font-semibold leading-tight">
          Find the perfect spot <br /> for your business idea
        </h2>
        <p className="mt-4 text-base">
          SpotWise provides AI recommendations for your business real estate
          location for its best success by its location.
        </p>
      </section>

      {/* Features Section */}
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(20%, 1fr))", // Replaced px with %
          gap: "2%",
          padding: "2%",
          zIndex: 10,
        }}
      >
        {features.map((feature, index) => (
          <Card
            key={index}
            sx={{
              width: "100%",
              height: "auto",
              borderRadius: "1rem", // Replaced px with rem
              boxShadow: 3,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flexShrink: 0,
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: 6,
              },
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
          >
            <CardMedia
              component="div"
              sx={{
                height: "20%", // Replaced px with %
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#588C87",
              }}
            >
              <Typography variant="h3">{feature.icon}</Typography>
            </CardMedia>
            <CardContent sx={{ backgroundColor: "white" }}>
              <Typography variant="h6" component="div">
                {feature.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {feature.description}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() =>
                  navigate(
                    feature.title === "Find What’s Best For You"
                      ? "/ai-recommendations"
                      : "#"
                  )
                } // Use navigate for routing
                sx={{ marginTop: "1rem" }} // Replaced px with rem
              >
                {feature.buttonText}
              </Button>
            </CardContent>
          </Card>
        ))}
      </Box>
    </div>
  );
};

const navItems = [
  { label: "Home", icon: "🏠" },
  { label: "Why SpotWise", icon: "❓" },
  { label: "Success Stories", icon: "🌟" },
  { label: "Contact", icon: "📞" },
  { label: "Login", icon: "🔑" },
];

const features = [
  {
    icon: "🏡",
    title: "Discover Locations",
    description: "Look at the listings of real estate",
    buttonText: "Discover",
  },
  {
    icon: "🔍",
    title: "Find What’s Best For You",
    description:
      "Get AI recommendation on the real estate listed here for your business",
    buttonText: "Find Now",
  },
  {
    icon: "🗺️",
    title: "Live Map",
    description: "Look at the live map of the locations listed on the site",
    buttonText: "Explore Map",
  },
  {
    icon: "📢",
    title: "List Your Property",
    description:
      "Come and list your property so more businesses can discover it",
    buttonText: "List It",
  },
];

export default HomePage;