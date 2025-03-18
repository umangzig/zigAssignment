import { Box, Typography, Container } from "@mui/material";

const Footer = () => {
  return (
    <Box component="footer" sx={{ py: 3, bgcolor: "grey.200", mt: "auto",  bottom: 0 }}>
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Assignment. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
