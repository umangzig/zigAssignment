export interface ToastProps {
  open: boolean;
  message: string | null;
  severity: "success" | "error" | "info" | "warning";
  onClose?: () => void;
  autoHideDuration?: number;
}
