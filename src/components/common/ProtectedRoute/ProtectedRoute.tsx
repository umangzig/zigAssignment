import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../../../utils/auth";
import { ProtectedRouteProps } from "../../../types/protectedRoute";

interface ExtendedProtectedRouteProps extends ProtectedRouteProps {
  redirectWhenAuthenticated?: boolean;
}

const ProtectedRoute = ({
  children,
  redirectWhenAuthenticated,
}: ExtendedProtectedRouteProps) => {
  if (redirectWhenAuthenticated && isAuthenticated()) {
    return <Navigate to="/products" replace />;
  }

  if (!redirectWhenAuthenticated && !isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
