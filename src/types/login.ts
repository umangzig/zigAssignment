export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginProps {
  onLoginSuccess: () => void;
}
