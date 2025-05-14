import { useAuth } from "@/hooks/auth";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthLayout() {
  const { isLogin } = useAuth();
  console.log(isLogin);
  if (isLogin) return <Navigate to="/" />;
  return (
    <div>
      <Outlet />
    </div>
  );
}
