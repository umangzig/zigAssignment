import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h3" color="error">
        404 - Page Not Found
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Oops! The page you are looking for does not exist.
      </Typography>
      <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate("/products")}>
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;
