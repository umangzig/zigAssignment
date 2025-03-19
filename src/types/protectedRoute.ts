import { ReactNode } from "react";

export interface ProtectedRouteProps {
  children: ReactNode;
}

export interface ExtendedProtectedRouteProps extends ProtectedRouteProps {
  redirectWhenAuthenticated?: boolean;
}
