import { Navigate } from "react-router-dom";
import { useUserContext } from "../context";

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { user } = useUserContext();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;
