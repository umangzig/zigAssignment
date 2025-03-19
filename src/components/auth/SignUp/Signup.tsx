import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { signupUser } from "../../../utils/auth";
import { SignupForm } from "../../../types/signUp";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { VALIDATION_MESSAGES } from "../../../constants/message";
import { REGEX } from "../../../constants/regex";
import { Toast } from "../../common/Toast/Toast";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<SignupForm>({
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const navigate = useNavigate();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const password = watch("password");

  const handleClickShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const onSubmit: SubmitHandler<SignupForm> = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        setError(VALIDATION_MESSAGES.PASSWORDS_DONT_MATCH);
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
      setSuccess(VALIDATION_MESSAGES.SIGNUP_SUCCESS); 
    } catch (error) {
      setError((error as Error).message || VALIDATION_MESSAGES.UNKNOWN_ERROR);
    }
  };

  const handleToastClose = () => {
    if (success) {
      setSuccess(""); 
      navigate("/"); 
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("firstName", {
                  required: VALIDATION_MESSAGES.REQUIRED,
                  validate: (value) =>
                    value.trim().length > 0 || VALIDATION_MESSAGES.SPACES_ONLY,
                })}
                label="First Name"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                onChange={async (e) => {
                  await register("firstName").onChange(e);
                  await trigger("firstName");
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                {...register("lastName", {
                  required: VALIDATION_MESSAGES.REQUIRED,
                  validate: (value) =>
                    value.trim().length > 0 || VALIDATION_MESSAGES.SPACES_ONLY,
                })}
                label="Last Name"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                onChange={async (e) => {
                  await register("lastName").onChange(e);
                  await trigger("lastName");
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("email", {
                  required: VALIDATION_MESSAGES.REQUIRED,
                  pattern: {
                    value: REGEX.EMAIL_REGEX,
                    message: VALIDATION_MESSAGES.INVALID_EMAIL,
                  },
                  validate: (value) =>
                    value.trim().length > 0 || VALIDATION_MESSAGES.SPACES_ONLY,
                })}
                label="Email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
                onChange={async (e) => {
                  await register("email").onChange(e);
                  await trigger("email");
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("mobile", {
                  required: VALIDATION_MESSAGES.REQUIRED,
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: VALIDATION_MESSAGES.INVALID_MOBILE,
                  },
                  validate: {
                    notEmpty: (value) =>
                      value.trim().length > 0 ||
                      VALIDATION_MESSAGES.SPACES_ONLY,
                    notAllZeros: (value) =>
                      value !== "0000000000" || VALIDATION_MESSAGES.ALL_ZEROS,
                    maxLength: (value) =>
                      value.length <= 10 ||
                      VALIDATION_MESSAGES.MAX_MOBILE_LENGTH,
                  },
                })}
                label="Mobile Number"
                fullWidth
                error={!!errors.mobile}
                helperText={errors.mobile?.message}
                onChange={async (e) => {
                  await register("mobile").onChange(e);
                  await trigger("mobile");
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("password", {
                  required: VALIDATION_MESSAGES.REQUIRED,
                  pattern: {
                    value: REGEX.PASSWORD_REGEX,
                    message: VALIDATION_MESSAGES.INVALID_PASSWORD,
                  },
                  validate: (value) =>
                    value.trim().length > 0 || VALIDATION_MESSAGES.SPACES_ONLY,
                })}
                type={showPassword ? "text" : "password"}
                label="Password"
                fullWidth
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("confirmPassword", {
                  required: VALIDATION_MESSAGES.REQUIRED,
                  validate: {
                    matchesPassword: (value) =>
                      value === password ||
                      VALIDATION_MESSAGES.PASSWORDS_DONT_MATCH,
                    notEmpty: (value) =>
                      value.trim().length > 0 ||
                      VALIDATION_MESSAGES.SPACES_ONLY,
                  },
                })}
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                onChange={async (e) => {
                  await register("confirmPassword").onChange(e);
                  await trigger("confirmPassword");
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        edge="end">
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
      <Toast
        open={!!success}
        message={success}
        severity="success"
        onClose={handleToastClose}
        autoHideDuration={1000}
      />
      <Toast
        open={!!error}
        message={error}
        severity="error"
        onClose={handleToastClose}
        autoHideDuration={1000}
      />
    </Container>
  );
};

export default Signup;