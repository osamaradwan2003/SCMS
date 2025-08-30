import { useSidebarLinks } from "@/hooks/routes";
import { Layout, Menu, Divider, Image, Typography, theme } from "antd";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import SidebarStyle from "./sidebar.module.css";

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapse] = useState(false);
  const items = useSidebarLinks();

  return (
    <Sider
      className={SidebarStyle.sidebar}
      style={{ backgroundColor: theme.useToken().token.colorBgBlur }}
      collapsible
      trigger={null}
      onCollapse={(collapsed) => setCollapse(collapsed)}
      width={220}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: !collapsed ? "space-between" : "center",
          padding: "1em 1.5em",
          fontWeight: "bold",
          gap: "0.5em",
        }}
      >
        <Image preview={false} src="/vite.svg" width={60} height={60}></Image>
        <br />
        {!collapsed ? (
          <Typography.Title style={{ flexGrow: 1 }} level={2}>
            SCMS
          </Typography.Title>
        ) : (
          ""
        )}
      </div>
      <Divider />
      <Menu items={items} mode="inline" selectedKeys={[location.pathname]} />
    </Sider>
  );
};
export default Sidebar;
