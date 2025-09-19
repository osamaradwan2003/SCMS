import RequireAuth from "@/components/auth/RequireAuth";
import { LOGIN_PATH } from "@/utils/contstance";
import { App, Layout, Spin, theme, Grid } from "antd";
import { Outlet } from "react-router-dom";
import HeaderBar from "./components/header/Header";
import { Suspense } from "react";

const { useBreakpoint } = Grid;

export default function MainLayout() {
  const { token } = theme.useToken();
  const screens = useBreakpoint();

  return (
    <>
      <RequireAuth
        redirect_path={`${LOGIN_PATH}?callbackUrl=${window.location.pathname}`}
      >
        <App>
          <Layout style={{ minHeight: "100vh" }}>
            {/* Header with navigation */}
            <HeaderBar />
            
            {/* Main Content */}
            <Suspense fallback={<Spin size="large" style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '50vh' 
            }} />}>
              <Layout.Content
                className={screens.xs ? "padding-1" : "padding-2"}
                style={{
                  backgroundColor: token.colorBgBase,
                  flexGrow: 1,
                  padding: screens.xs ? '8px' : screens.sm ? '16px' : '24px',
                }}
              >
                <Outlet />
              </Layout.Content>
            </Suspense>
          </Layout>
        </App>
      </RequireAuth>
    </>
  );
}
