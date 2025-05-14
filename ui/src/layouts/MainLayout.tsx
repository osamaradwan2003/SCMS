import RequireAuth from "@/components/auth/RequireAuth";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <>
      <RequireAuth redirect_path="/auth/login">
        <Outlet />
      </RequireAuth>
    </>
  );
}
