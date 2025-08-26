import RequireAuth from "@/components/auth/RequireAuth";
import { LOGIN_PATH } from "@/utils/contstance";
import { App, Layout, Spin, theme } from "antd";
import { Outlet } from "react-router-dom";
import HeaderBar from "./components/header/Header";
import { Suspense } from "react";
import Sidebar from "./components/sidebar/Sidebar";

export default function MainLayout() {
  return (
    <>
      <RequireAuth
        redirect_path={`${LOGIN_PATH}?callbackUrl=${window.location.pathname}`}
      >
        <App>
          <Layout>
            <Sidebar />
            <Layout style={{ minHeight: "100vh" }}>
              <HeaderBar />
              <Suspense fallback={<Spin />}>
                <Layout.Content
                  className="padding-2"
                  style={{
                    backgroundColor: theme.useToken().token.colorBgBase,
                    flexGrow: 1,
                  }}
                >
                  <Outlet />
                </Layout.Content>
              </Suspense>
            </Layout>
          </Layout>
        </App>
      </RequireAuth>
    </>
  );
}
