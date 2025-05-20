import { App, Layout, Spin, theme } from "antd";
import { Outlet } from "react-router-dom";
import HeaderBar from "./components/header/Header";
import { Suspense } from "react";

export default function AuthLayout() {
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
