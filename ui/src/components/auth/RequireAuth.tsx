import { useAuth } from "@/hooks/auth";
import { Navigate } from "react-router-dom";

const RequireAuth: React.FC<
  React.PropsWithChildren<{
    redirect_path: string;
  }>
> = ({ children, redirect_path }) => {
  const { isLogin } = useAuth();
  if (isLogin) return children;
  return <Navigate to={redirect_path} state={401} />;
};

export default RequireAuth;
