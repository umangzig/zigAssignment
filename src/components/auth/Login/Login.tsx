import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Paper,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoginForm, LoginProps } from "../../../types/login";
import { loginUser } from "../../../utils/auth";

const Login = ({ onLoginSuccess }: LoginProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    try {
      await loginUser(data.email, data.password);
      onLoginSuccess();
      navigate("/products");
    } catch (error) {
      setError((error as Error).message);
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
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
            label="Email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            {...register("password", { required: "Password is required" })}
            type="password"
            label="Password"
            fullWidth
            margin="normal"
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Login
          </Button>
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            Don't have an account?
            <Link to="/signup">Sign Up</Link>
          </Typography>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
