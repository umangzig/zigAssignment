import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
} from "@mui/material";
import { useState, useEffect } from "react";
import { User } from "../../../types/user";
import { useNavigate } from "react-router-dom";
import { Toast } from "../../common/Toast/Toast";
import { VALIDATION_MESSAGES } from "../../../constants/message";
import { REGEX } from "../../../constants/regex";

const EditProfile = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<User>({
    mode: "onChange", 
  });
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

  const handleToastClose = () => {
    if (success) {
      setSuccess("");
      navigate("/products");
    } else {
      setError("");
    }
  };

  const onSubmit: SubmitHandler<User> = (data) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const emailExists = users.find(
      (user: User) =>
        user.email === data.email && user.email !== currentUser.email
    );

    if (emailExists) {
      setError(VALIDATION_MESSAGES.ALREADY_EXITS);
      return;
    } else {
      const updatedUser = { ...currentUser, ...data };
      const updatedUsers = users.map((user: User) =>
        user.email === currentUser.email ? updatedUser : user
      );

      localStorage.setItem("users", JSON.stringify(updatedUsers));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setSuccess(VALIDATION_MESSAGES.PROFILE_UPDATE_SUCCESS);
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("firstName", {
              required: VALIDATION_MESSAGES.REQUIRED,
              validate: {
                notOnlySpaces: (value) =>
                  value.trim().length > 0 || VALIDATION_MESSAGES.SPACES_ONLY,
              },
            })}
            label="First Name"
            fullWidth
            margin="normal"
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
          />
          <TextField
            {...register("lastName", {
              required: VALIDATION_MESSAGES.REQUIRED,
              validate: {
                notOnlySpaces: (value) =>
                  value.trim().length > 0 || VALIDATION_MESSAGES.SPACES_ONLY,
              },
            })}
            label="Last Name"
            fullWidth
            margin="normal"
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
          />
          <TextField
            {...register("email", {
              required: VALIDATION_MESSAGES.REQUIRED,
              pattern: {
                value: REGEX.EMAIL_REGEX,
                message: VALIDATION_MESSAGES.INVALID_EMAIL,
              },
              validate: {
                noLeadingSpace: (value) =>
                  value.trimStart() === value ||
                  VALIDATION_MESSAGES.NOT_START_WITH_SPACE,
                notOnlySpaces: (value) =>
                  value.trim().length > 0 || VALIDATION_MESSAGES.NOT_ONLY_SPACE,
              },
            })}
            label="Email"
            fullWidth
            margin="normal"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            {...register("mobile", {
              required: VALIDATION_MESSAGES.REQUIRED,
              pattern: {
                value: REGEX.MOBILE_REGEX,
                message: VALIDATION_MESSAGES.INVALID_MOBILE,
              },
              validate: {
                exactLength: (value) =>
                  value.length === 10 || VALIDATION_MESSAGES.MAX_MOBILE_LENGTH,
                notOnlyZeros: (value) =>
                  value !== "0".repeat(10) || VALIDATION_MESSAGES.ALL_ZEROS,
                notOnlySpaces: (value) =>
                  value.trim().length > 0 || VALIDATION_MESSAGES.SPACES_ONLY,
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

export default EditProfile;