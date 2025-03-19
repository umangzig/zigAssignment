import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoginForm, LoginProps } from "../../../types/login";
import { loginUser } from "../../../utils/auth";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { VALIDATION_MESSAGES } from "../../../constants/message"; 
import { REGEX } from "../../../constants/regex"; 
import { Toast } from "../../common/Toast/Toast";

const Login = ({ onLoginSuccess }: LoginProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger, 
  } = useForm<LoginForm>({
    mode: "onChange", 
    reValidateMode: "onChange", 
  });
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      await loginUser(data.email, data.password);
      setSuccess(VALIDATION_MESSAGES.LOGIN_SUCCESS); 
      setError(""); 
      setTimeout(() => {
        onLoginSuccess();
      }, 1000);
    } catch (error) {
      setError((error as Error).message || VALIDATION_MESSAGES.UNKNOWN_ERROR);
    }
  };

  const handleToastClose = () => {
    if (success) {
      setSuccess(""); 
      navigate("/products"); 
    } else {
      setError(""); 
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        alignItems: "center",
        background: "var(--global-bg)",
        "&.MuiContainer-root": {
          maxWidth: "none",
        },
      }}>
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Login
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("email", {
              required: VALIDATION_MESSAGES.REQUIRED,
              pattern: {
                value: REGEX.EMAIL_REGEX, 
                message: VALIDATION_MESSAGES.INVALID_EMAIL,
              },
              validate: {
                notOnlySpaces: (value) =>
                  value.trim().length > 0 || VALIDATION_MESSAGES.SPACES_ONLY,
                noLeadingSpace: (value) =>
                  value.trimStart() === value ||
                  "Email cannot start with a space",
              },
            })}
            label="Email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
            onChange={async (e) => {
              await register("email").onChange(e); 
              await trigger("email"); 
            }}
          />
          <TextField
            {...register("password", {
              required: VALIDATION_MESSAGES.REQUIRED,
              validate: (value) =>
                value.trim().length > 0 || VALIDATION_MESSAGES.SPACES_ONLY,
            })}
            type={showPassword ? "text" : "password"}
            label="Password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
            onChange={async (e) => {
              await register("password").onChange(e); 
              await trigger("password"); 
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </Typography>
        </form>
      </Paper>
      <Toast
        open={!!success}
        message={success}
        severity="success"
        onClose={handleToastClose}
      />
      <Toast
        open={!!error}
        message={error}
        severity="error"
        onClose={handleToastClose}
      />
    </Container>
  );
};

export default Login;