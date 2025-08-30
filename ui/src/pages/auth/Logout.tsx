import { useAuth } from "@/hooks/auth";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
// import { Navigate } from "react-router-dom";

export default function Logout() {
  const { logout } = useAuth();
  useEffect(() => {
    logout();
  });
  return <Navigate to="/auth/login" />;
}
