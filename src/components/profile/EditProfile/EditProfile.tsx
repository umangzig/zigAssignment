import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import { useState, useEffect } from "react";
import { User } from "../../../types/user";
import { useNavigate } from "react-router-dom";
34499917034
const EditProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<User>();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    reset({
      id: currentUser.id,
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      email: currentUser.email,
      mobile: currentUser.mobile,
    });
  }, [reset]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const onSubmit: SubmitHandler<User> = (data) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const emailExists = users.find(
      (user: User) =>
        user.email === data.email && user.email !== currentUser.email
    );

    if (emailExists) {
      setError("Email already exists");
      return;
    } else {
      const updatedUser = { ...currentUser, ...data };
      const updatedUsers = users.map((user: User) =>
        user.email === currentUser.email ? updatedUser : user
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setSuccess("Profile updated successfully");
      setError("");

      setTimeout(() => {
        navigate("/products");
      }, 1000);
    }
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Edit Profile
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("firstName", { required: "First Name is required" })}
            label="First Name"
            fullWidth
            margin="normal"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
          <TextField
            {...register("lastName", { required: "Last Name is required" })}
            label="Last Name"
            fullWidth
            margin="normal"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
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
            {...register("mobile", {
              required: "Mobile is required",
              pattern: {
                value: /^[0-9]+$/, 
                message: "Only numbers are allowed",
              },
              maxLength: {
                value: 10,
                message: "Mobile number cannot exceed 10 digits",
              },
            })}
            label="Mobile"
            fullWidth
            margin="normal"
            error={!!errors.mobile}
            helperText={errors.mobile?.message}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!isDirty}>
            Update Profile
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default EditProfile;
