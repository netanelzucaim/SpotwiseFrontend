import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Button,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import "../../styles/Home.css";
import userService from "../../services/user_service"; 
import BrandHeading from "../Logo/Logo";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("userId"));

  const navItems = [
    { label: "Home", icon: "🏠", path: "/home" },
    { label: "Why SpotWise", icon: "❓", path: "/home" },
    { label: "Success Stories", icon: "🌟", path: "/home" },
    { label: "Contact", icon: "📞", path: "/home" },
    ...(isLoggedIn
      ? [
          {
            label: "Logout",
            icon: "🚪",
            path: "/login",
            onClick: async () => {
              try {
                await userService.logout();
                navigate("/login"); 
              } catch (error) {
                console.error("Failed to logout:", error);
              }
            },
          },
        ]
      : [
          {
            label: "Login",
            icon: "🔑",
            path: "/login",
            onClick: () => navigate("/login"), 
          },
        ]),
  ];

  return (
    <div
      className="min-h-screen 
      bg-cover 
      bg-center 
      text-white 
      flex flex-col 
      items-center 
      home-page"
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <header className="relative w-full flex flex-col items-center text-center p-4 z-10">
      <BrandHeading></BrandHeading>
        <nav className="flex gap-2 justify-center items-center mt-2">
          {navItems.map((item, index) => (
            <Button
              key={index}
              startIcon={<span>{item.icon}</span>}
              onClick={item.onClick} 
              sx={{
                backgroundColor: "",
                "&:hover": { backgroundColor: "#588C87" },
                borderRadius: "20px",
                padding: "0.5rem 2rem",
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

      <section className="relative text-center py-8 px-4 max-w-90% z-10">
        <h2 className="text-3xl font-semibold leading-tight">
          Find the perfect spot <br /> for your business idea
        </h2>
        <p className="mt-4 text-base">
          SpotWise provides AI recommendations for your business real estate
          location for its best success by its location.
        </p>
      </section>

      {isLoggedIn && (
        <Box
          sx={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(20%, 1fr))",
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
                borderRadius: "1rem",
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
                  height: "20%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#588C87",
                }}
              >
                <Typography variant="h3">{feature.icon}</Typography>
              </CardMedia>
              <CardContent
                sx={{
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    textAlign: "center",
                    marginBottom: "1rem",
                    fontWeight: "bold",
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {feature.description}
                </Typography>
                {feature.title === "Create Your Property" ? (
                  <Box sx={{ display: "flex", gap: 2, marginTop: "1rem" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => navigate("/real-estate-profile")}
                    >
                      Real Estate
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      onClick={() => navigate("/business-profile")}
                    >
                      Business
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() =>
                      navigate(
                        feature.title === "Find What’s Best For You"
                          ? "/ai-recommendations"
                          : feature.title === "Discover Locations"
                          ? "/discover-locations"
                          : feature.title === "Live Map"
                          ? "/map"
                          : "#"
                      )
                    }
                    sx={{ marginTop: "1rem" }}
                  >
                    {feature.buttonText}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </div>
  );
};

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
    title: "Create Your Property",
    description:
      "Come and Create your property so more businesses/users can discover it",
    buttonText: "List It",
  },
];

export default HomePage;