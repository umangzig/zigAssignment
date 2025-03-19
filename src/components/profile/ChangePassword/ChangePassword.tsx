import { useForm, SubmitHandler } from "react-hook-form";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import { ChangePasswordForm } from "../../../types/changePassword";
import { decryptPassword, encryptPassword } from "../../../utils/encryption";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { VALIDATION_MESSAGES } from "../../../constants/message";
import { REGEX } from "../../../constants/regex";
import { Toast } from "../../common/Toast/Toast";
import useDebounce from "../../common/useDebounce/useDebounce";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    setError: setFormError,
  } = useForm<ChangePasswordForm>({
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false); 
  const newPassword = watch("newPassword");
  const currentPassword = watch("currentPassword");
  const debouncedCurrentPassword = useDebounce(currentPassword, 500); 
  const navigate = useNavigate();

  const handleClickShowCurrentPassword = () =>
    setShowCurrentPassword((prev) => !prev);
  const handleClickShowNewPassword = () => setShowNewPassword((prev) => !prev);
  const handleClickShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  useEffect(() => {
    if (currentPassword !== debouncedCurrentPassword) {
      setIsChecking(true);
    } else {
      setIsChecking(false); 
    }

    if (debouncedCurrentPassword) {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      const decryptedPassword = decryptPassword(currentUser.password);

      if (
        debouncedCurrentPassword.trim().length > 0 &&
        debouncedCurrentPassword !== decryptedPassword
      ) {
        setFormError("currentPassword", {
          type: "manual",
          message: VALIDATION_MESSAGES.CURRENT_PASSWORD_INCORRECT,
        });
        setIsCurrentPasswordValid(false);
      } else if (debouncedCurrentPassword === decryptedPassword) {
        setIsCurrentPasswordValid(true);
        if (errors.currentPassword?.type === "manual") {
          setFormError("currentPassword", { type: "manual", message: "" });
        }
      } else {
        setIsCurrentPasswordValid(false);
      }
    } else {
      setIsCurrentPasswordValid(false);
    }
  }, [
    debouncedCurrentPassword,
    currentPassword,
    setFormError,
    errors.currentPassword,
  ]);

  const onSubmit: SubmitHandler<ChangePasswordForm> = (data) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (decryptPassword(currentUser.password) !== data.currentPassword) {
      setError(VALIDATION_MESSAGES.CURRENT_PASSWORD_INCORRECT);
      return;
    }

    if (data.newPassword === decryptPassword(currentUser.password)) {
      setError(VALIDATION_MESSAGES.SAME_AS_CURRENT);
      return;
    }

    if (data.newPassword !== data.confirmNewPassword) {
      setError(VALIDATION_MESSAGES.PASSWORDS_DONT_MATCH);
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
    setSuccess(VALIDATION_MESSAGES.PASSWORD_CHANGE_SUCCESS);
    setError("");
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
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Change Password
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("currentPassword", {
              required: VALIDATION_MESSAGES.REQUIRED,
              validate: {
                notOnlySpaces: (value) =>
                  value.trim().length > 0 || VALIDATION_MESSAGES.SPACES_ONLY,
              },
            })}
            type={showCurrentPassword ? "text" : "password"}
            label="Current Password"
            fullWidth
            margin="normal"
            error={!!errors.currentPassword}
            helperText={errors.currentPassword?.message}
            onChange={async (e) => {
              await register("currentPassword").onChange(e);
              await trigger("currentPassword");
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {isChecking && (
                    <CircularProgress size={20} sx={{ mr: 1 }} /> 
                  )}
                  <IconButton
                    aria-label="toggle current password visibility"
                    onClick={handleClickShowCurrentPassword}
                    edge="end">
                    {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            {...register("newPassword", {
              required: VALIDATION_MESSAGES.REQUIRED,
              pattern: {
                value: REGEX.PASSWORD_REGEX,
                message: VALIDATION_MESSAGES.INVALID_PASSWORD,
              },
              validate: {
                notOnlySpaces: (value) =>
                  value.trim().length > 0 || VALIDATION_MESSAGES.SPACES_ONLY,
              },
            })}
            type={showNewPassword ? "text" : "password"}
            label="New Password"
            fullWidth
            margin="normal"
            disabled={!isCurrentPasswordValid}
            error={!!errors.newPassword}
            helperText={errors.newPassword?.message}
            onChange={async (e) => {
              await register("newPassword").onChange(e);
              await trigger("newPassword");
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle new password visibility"
                    onClick={handleClickShowNewPassword}
                    edge="end">
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            {...register("confirmNewPassword", {
              required: VALIDATION_MESSAGES.REQUIRED,
              validate: {
                matchesNewPassword: (value) =>
                  value === newPassword ||
                  VALIDATION_MESSAGES.PASSWORDS_DONT_MATCH,
                notOnlySpaces: (value) =>
                  value.trim().length > 0 || VALIDATION_MESSAGES.SPACES_ONLY,
              },
            })}
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm New Password"
            fullWidth
            margin="normal"
            disabled={!isCurrentPasswordValid}
            error={!!errors.confirmNewPassword}
            helperText={errors.confirmNewPassword?.message}
            onChange={async (e) => {
              await register("confirmNewPassword").onChange(e);
              await trigger("confirmNewPassword");
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={handleClickShowConfirmPassword}
                    edge="end">
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={!isCurrentPasswordValid}>
            Change Password
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

export default ChangePassword;