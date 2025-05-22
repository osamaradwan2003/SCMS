import { App, Layout, Spin, theme } from "antd";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import HeaderBar from "./components/header/Header";
import { Suspense } from "react";
import { useAuth } from "@/hooks/auth";

export default function AuthLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const redirect_path = location.search.split("callbackUrl=")[1] || "/";
  if (user) return <Navigate to={`${redirect_path}`} replace />;
  return (
    <>
      <App>
        <Layout style={{ minHeight: "100vh" }}>
          <HeaderBar />
          <Suspense fallback={<Spin />}>
            <Layout.Content
              style={{
                backgroundColor: theme.useToken().token.colorBgBase,
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
