// Logo.tsx
import { Link } from 'react-router-dom';
import { Box } from "@mui/material";

export const BrandHeading = () => {
  return (
    <header className="flex flex-col items-center text-center pt-0 pb-2 text-black" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <Link to="/home" className="text-black no-underline">
        <h1 className="fw-bold">SpotWise</h1>
      </Link>
      <p className="text-sm text-gray-700">
        Your Vision, The Perfect Location.
      </p>
    </header>
  );
};

const Logo: React.FC = () => {
  return (
    <Box display="flex" alignItems="center">
      <img
        src="/assets/standing-wizo.png"
        alt="SpotWise Logo"
        className="logo"
      />
      <Link to="/home" className="logo-name">SpotWise</Link>
    </Box>
  );
};

export default Logo;
