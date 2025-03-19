import { Button } from "@mui/material";
import { logoutUser } from "../../../utils/auth";
import { useNavigate } from "react-router-dom";
import { LogoutButtonProps } from "../../../types/logout";

const LogoutButton = ({ onLogoutSuccess }: LogoutButtonProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    if (onLogoutSuccess) {
      onLogoutSuccess();
    }
    navigate("/");
  };

  return (
    <Button variant="outlined" color="error" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
