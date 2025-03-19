import { Alert, Snackbar } from "@mui/material";
import { ToastProps } from "../../../types/toast";
export const Toast = ({
  open,
  message,
  severity,
  onClose,
  autoHideDuration = 2000,
}: ToastProps) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}>
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};
