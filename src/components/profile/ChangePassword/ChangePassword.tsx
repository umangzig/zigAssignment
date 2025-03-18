import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { ChangePasswordForm } from "../../../types/changePassword";
import { decryptPassword, encryptPassword } from "../../../utils/encryption";



const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ChangePasswordForm>();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const newPassword = watch("newPassword");

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/;

  const onSubmit: SubmitHandler<ChangePasswordForm> = (data) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (decryptPassword(currentUser.password) !== data.currentPassword) {
      setError("Current password is incorrect");
      return;
    }

    if (data.newPassword === decryptPassword(currentUser.password)) {
      setError("New password cannot be the same as the current password");
      return;
    }

    if (data.newPassword !== data.confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }

    const updatedUser = {
      ...currentUser,
      password: encryptPassword(data.newPassword),
    };
    const updatedUsers = users.map((user: any) =>
      user.email === currentUser.email ? updatedUser : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setSuccess("Password changed successfully");
    setError("");
    
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Change Password
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
            {...register("currentPassword", {
              required: "Current Password is required",
            })}
            type="password"
            label="Current Password"
            fullWidth
            margin="normal"
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
          />
          <TextField
            {...register("newPassword", {
              required: "New Password is required",
              pattern: {
                value: passwordRegex,
                message:
                  "Password must be 8-32 characters with uppercase, lowercase, number, and special character",
              },
            })}
            type="password"
            label="New Password"
            fullWidth
            margin="normal"
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
          />
          <TextField
            {...register("confirmNewPassword", {
              required: "Confirm New Password is required",
              validate: (value) =>
                value === newPassword || "Passwords do not match",
            })}
            type="password"
            label="Confirm New Password"
            fullWidth
            margin="normal"
            error={!!errors.confirmNewPassword}
            helperText={errors.confirmNewPassword?.message}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Change Password
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ChangePassword;
