import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Box,
  
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import LogoutButton from "../../auth/Logout/LogoutButton";
import { HeaderProps } from "../../../types/header";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useAppSelector } from "../../../redux/hooks";

const Header = ({ onLogoutSuccess }: HeaderProps) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const cartItems = useAppSelector((state) => state.cart.items);

  const handleProfileClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <AppBar position="sticky">
        <Container
          sx={{
            maxWidth: "none",
            height: "70px",
            background: "var(--global-bg)",
            "&.MuiContainer-root": {
              display: "flex",
              alignContent: "center",
              justifyContent: "space-between",
              maxWidth: "none",
            },
          }}>
          <Toolbar
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}>
            <>
              <Typography
                variant="h6"
                component={Link}
                to="/products"
                sx={{
                  flexGrow: 1,
                  textDecoration: "none",
                  color: "inherit",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    bottom: -2,
                    width: "0%",
                    height: "2px",
                    backgroundColor: "currentColor",
                    transition: "width 0.3s ease-in-out",
                  },
                  "&:hover::after": {
                    width: "7%",
                  },
                }}>
                Products
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                }}>
                <IconButton
                  size="large"
                  color="inherit"
                  onClick={() => navigate("/cart")}>
                  <ShoppingCartOutlinedIcon fontSize="large" />
                </IconButton>

                <Box
                  sx={{
                    position: "absolute",
                    top: 2,
                    right: 4,
                    width: 20,
                    height: 20,
                    bgcolor: "white",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: 1,
                  }}>
                  <Typography
                    variant="caption"
                    sx={{ color: "black", fontWeight: "bold" }}>
                    {cartItems.length}
                  </Typography>
                </Box>
              </Box>

              <IconButton
                size="large"
                color="inherit"
                onClick={handleProfileClick}>
                <AccountCircleIcon fontSize="large" />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  "& .MuiPaper-root": {
                    borderRadius: "10px",
                    minWidth: 180,
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                    padding: "5px",
                  },
                }}>
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleClose();
                  }}>
                  <ListItemIcon>
                    <AccountCircleIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="inherit">Edit Profile</Typography>
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    navigate("/change-password");
                    handleClose();
                  }}>
                  <ListItemIcon>
                    <LockIcon fontSize="small" />
                  </ListItemIcon>
                  <Typography variant="inherit">Change Password</Typography>
                </MenuItem>

                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <LogoutButton onLogoutSuccess={onLogoutSuccess} />
                </MenuItem>
              </Menu>
            </>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

export default Header;