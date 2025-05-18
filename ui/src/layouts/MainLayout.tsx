import RequireAuth from "@/components/auth/RequireAuth";
import { LOGIN_PATH } from "@/utils/contstance";
import { App, Layout, Spin } from "antd";
import { Outlet } from "react-router-dom";
import HeaderBar from "./components/Header";
import { Suspense } from "react";
import SideBar from "./components/Sidebar";

export default function MainLayout() {
  return (
    <>
      <RequireAuth redirect_path={LOGIN_PATH}>
        <App>
          <Layout>
            <SideBar />
            <Layout>
              <HeaderBar />
              <Suspense fallback={<Spin />}>
                <Layout.Content>
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
