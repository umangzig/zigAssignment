import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Grid,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signupUser } from "../../../utils/auth";
import { SignupForm } from "../../../types/signUp";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupForm>();
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const password = watch("password");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;

  const onSubmit: SubmitHandler<SignupForm> = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const userData = {
        id: Math.random(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile,
        password: data.password,
      };

      await signupUser(userData);
      setError("");
      navigate("/login");
    } catch (error) {
      setError((error as Error).message || "An error occurred during signup");
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "var(--global-bg)",
        "&.MuiContainer-root": {
          maxWidth: "none",
        },
      }}>
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 400 }}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Sign Up
          </Typography>
        </Box>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("firstName", {
                  required: "First Name is required",
                })}
                label="First Name"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("lastName", { required: "Last Name is required" })}
                label="Last Name"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
                })}
                label="Email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("mobile", {
                  required: "Mobile is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Mobile number must be exactly 10 digits",
                  },
                })}
                label="Mobile Number"
                fullWidth
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("password", {
                  required: "Password is required",
                  pattern: {
                    value: passwordRegex,
                    message:
                      "Password must be 8-32 characters with uppercase, lowercase, number, and special character",
                  },
                })}
                type="password"
                label="Password"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                type="password"
                label="Confirm Password"
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}>
                Sign Up
              </Button>
              <Button
                variant="text"
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => navigate("/")}>
                Back To Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default Signup;
