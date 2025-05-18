import { Layout, Menu, Divider, Image, Typography, theme } from "antd";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { sidebarItems } from "./sidebarItems";

const { Sider } = Layout;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapse] = useState(false);
  const handleClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <Sider
      style={{ backgroundColor: theme.useToken().token.colorBgBlur }}
      collapsible
      onCollapse={(collapsed) => setCollapse(collapsed)}
      width={220}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: !collapsed ? "space-between" : "center",
          padding: "1em 1.5em",
          color: "#fff",
          fontWeight: "bold",
          gap: "0.5em",
        }}
      >
        <Image preview={false} src="./vite.svg" width={60} height={60}></Image>
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
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[location.pathname]}
        onClick={handleClick}
        // items={sidebarItems}
        style={{ marginTop: 8 }}
      />
    </Sider>
  );
};
export default Sidebar;
