import { Box } from "@mui/material";
import { Link } from "react-router-dom";

const Logo: React.FC = () => {
    return(
        <Box display="flex" alignItems="center">
            <img
            src="/assets/standing-wizo.png"
            alt="SpotWise Logo"
            className="logo"
            />
            <Link to="/home" className="logo-name">SpotWise</Link>
        </Box>
    )
}

export default Logo;