import { useAuth } from "@/hooks/auth";
import { Navigate, useLocation } from "react-router-dom";
import { Spin } from "antd";

const RequireAuth: React.FC<
  React.PropsWithChildren<{
    redirect_path: string;
  }>
> = ({ children, redirect_path }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }
  
  if (isAuthenticated) {
    const firstLogin = user?.firstLogin;
    const mustChange = user?.mustChangePassword;
    const onChangePassword = location.pathname === "/auth/change-password";
    if ((firstLogin || mustChange) && !onChangePassword) {
      return <Navigate to="/auth/change-password" replace />;
    }
    return children;
  }
  return <Navigate to={redirect_path} state={401} />;
};

export default RequireAuth;
