import { App, Layout, Spin, theme } from "antd";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import HeaderBar from "./components/header/Header";
import { Suspense } from "react";
import { useAuth } from "@/hooks/auth";

export default function AuthLayout() {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const redirect_path = location.search.split("callbackUrl=")[1] || "/";
  // Call AntD theme.useToken() exactly once per render (avoid calling inside conditional branches)
  const { token } = theme.useToken();

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // If user is logged in but must change password or it's first login, allow access to /auth/change-password
  const onChangePassword = location.pathname === "/auth/change-password";
  const needsPasswordChange = !!(user?.firstLogin || user?.mustChangePassword);
  // If user needs to change password, redirect to change-password page
  if (user && needsPasswordChange && !onChangePassword) {
    return <Navigate to="/auth/change-password" replace />;
  }

  // If user is on change-password page and needs to change password, allow access
  if (user && needsPasswordChange && onChangePassword) {
    return (
      <>
        <App>
          <Layout style={{ minHeight: "100vh" }}>
            <HeaderBar />
            <Suspense fallback={<Spin />}>
              <Layout.Content
                style={{
                  backgroundColor: token.colorBgBase,
                  flexGrow: 1,
                }}
              >
                <Outlet />
              </Layout.Content>
            </Suspense>
          </Layout>
        </App>
      </>
    );
  }

  // If user is logged in and doesn't need to change password, redirect to main app
  if (user) return <Navigate to={`${redirect_path}`} replace />;
  return (
    <>
      <App>
        <Layout style={{ minHeight: "100vh" }}>
          <HeaderBar />
          <Suspense fallback={<Spin />}>
            <Layout.Content
              style={{
                backgroundColor: token.colorBgBase,
                flexGrow: 1,
              }}
            >
              <Outlet />
            </Layout.Content>
          </Suspense>
        </Layout>
      </App>
    </>
  );
}
