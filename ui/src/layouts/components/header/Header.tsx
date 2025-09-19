import { Layout, Avatar, Dropdown, theme, Button, Menu, Image, Typography, Grid } from "antd";
import { useAuth } from "@/hooks/auth";
const { Header } = Layout;
import headerStyle from "./header.module.css";
import { useProfileLinks, useSidebarLinks } from "@/hooks/routes.tsx";
import { useLocation } from "react-router-dom";

import ThemeToggler from "@/components/buttons/ThemeToggler";
import LangToggler from "@/components/buttons/LangToggler";
import { MenuOutlined } from "@ant-design/icons";

const { useBreakpoint } = Grid;
const { Title } = Typography;

const HeaderBar = () => {
  const { user } = useAuth();
  const profileItems = useProfileLinks();
  const navigationItems = useSidebarLinks();
  const location = useLocation();
  const screens = useBreakpoint();
  const { token } = theme.useToken();

  return (
    <Header
      style={{ backgroundColor: token.colorBgBlur }}
      className={headerStyle.header}
    >
      {/* Logo */}
      <div className={headerStyle.logo}>
        <Image preview={false} src="/vite.svg" width={40} height={40} />
        {!screens.xs && (
          <Title level={4} style={{ margin: 0, color: token.colorText }}>
            SCMS
          </Title>
        )}
      </div>

      {/* Navigation Menu */}
      <div className={headerStyle.navigation}>
        {screens.xs || screens.sm ? (
          // Mobile: Dropdown menu
          <Dropdown
            menu={{ items: navigationItems }}
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
          // Desktop: Horizontal menu
          <Menu 
            items={navigationItems} 
            mode="horizontal" 
            selectedKeys={[location.pathname]}
            style={{ 
              backgroundColor: 'transparent',
              border: 'none',
              flex: 1,
            }}
            overflowedIndicator={
              <Button 
                type="text" 
                icon={<MenuOutlined />}
                style={{ fontSize: '16px' }}
              />
            }
          />
        )}
      </div>

      {/* Right side controls */}
      <div className={headerStyle.controls}>
        <ThemeToggler />
        <LangToggler />
        {user && (
          <Dropdown menu={{ items: profileItems }} placement="bottomRight">
            <Avatar src={user?.image}>
              {user?.name.charAt(0).toUpperCase()}
            </Avatar>
          </Dropdown>
        )}
      </div>
    </Header>
  );
};

export default HeaderBar;
