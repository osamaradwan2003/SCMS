import { useSidebarLinks } from "@/hooks/routes.tsx";
import { Layout, Menu, Divider, Image, Typography, theme, Dropdown, Button } from "antd";
import { useLocation } from "react-router-dom";
import { MenuOutlined, MoreOutlined } from "@ant-design/icons";
import SidebarStyle from "./sidebar.module.css";

const { Sider, Header } = Layout;

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  isMobile?: boolean;
  isHorizontal?: boolean;
};

export default function Sidebar({ collapsed, setCollapsed, isMobile, isHorizontal }: SidebarProps) {
  const location = useLocation();
  const items = useSidebarLinks();

  // Horizontal layout (top navigation)
  if (isHorizontal) {
    return (
      <Header
        className={`${SidebarStyle.sidebar} ${SidebarStyle.horizontalNav}`}
        style={{
          backgroundColor: theme.useToken().token.colorBgBlur,
          padding: '0 16px',
          height: 'auto',
          lineHeight: 'normal',
          borderBottom: `1px solid ${theme.useToken().token.colorBorder}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 0",
            gap: "16px",
            width: "100%",
          }}
        >
          {/* Logo */}
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "12px",
            flexShrink: 0,
          }}>
            <Image preview={false} src="/vite.svg" width={40} height={40} />
            {!isMobile && (
              <Typography.Title style={{ margin: 0 }} level={3}>
                SCMS
              </Typography.Title>
            )}
          </div>
          
          {/* Navigation Menu */}
          {isMobile ? (
            // Mobile: Dropdown menu
            <Dropdown
              menu={{ items }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button 
                type="text" 
                icon={<MenuOutlined />}
                style={{ fontSize: '18px' }}
              />
            </Dropdown>
          ) : (
            // Desktop: Horizontal menu with overflow handling
            <div style={{ 
              flex: 1, 
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
            }}>
              <Menu 
                items={items} 
                mode="horizontal" 
                selectedKeys={[location.pathname]}
                style={{ 
                  backgroundColor: 'transparent',
                  border: 'none',
                  minWidth: 0,
                  maxWidth: '100%',
                }}
                overflowedIndicator={
                  <Button 
                    type="text" 
                    icon={<MoreOutlined />}
                    style={{ fontSize: '16px' }}
                  />
                }
              />
            </div>
          )}
        </div>
      </Header>
    );
  }

  // Vertical layout (traditional sidebar)
  return (
    <Sider
      className={SidebarStyle.sidebar}
      style={{ 
        backgroundColor: theme.useToken().token.colorBgBlur,
        ...(isMobile && collapsed ? { 
          position: 'fixed', 
          zIndex: 1000, 
          height: '100vh',
          left: '-200px',
          transition: 'left 0.3s ease'
        } : {}),
        ...(isMobile && !collapsed ? { 
          position: 'fixed', 
          zIndex: 1000, 
          height: '100vh',
          left: '0px',
          transition: 'left 0.3s ease'
        } : {})
      }}
      collapsible
      trigger={null}
      collapsed={isMobile ? false : collapsed}
      onCollapse={(next) => setCollapsed(next)}
      width={isMobile ? 250 : 220}
      collapsedWidth={isMobile ? 0 : 80}
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
}
