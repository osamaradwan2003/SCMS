import { useAuth } from "@/hooks/auth";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated);
  if (isAuthenticated) return <Navigate to="/" />;
  return (
    <div style={{ margin: "50px auto" }}>
      <Outlet />
    </div>
  );
}
