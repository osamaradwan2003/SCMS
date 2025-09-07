import { useAuth } from "@/hooks/auth";
import { Navigate } from "react-router-dom";
import { Spin } from "antd";

const RequireAuth: React.FC<
  React.PropsWithChildren<{
    redirect_path: string;
  }>
> = ({ children, redirect_path }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
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
  
  if (isAuthenticated) return children;
  return <Navigate to={redirect_path} state={401} />;
};

export default RequireAuth;
