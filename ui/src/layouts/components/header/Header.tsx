import { Layout, Avatar, Dropdown, theme } from "antd";
import { useAuth } from "@/hooks/auth";
const { Header } = Layout;
import headerStyle from "./header.module.css";
import { useProfileLinks } from "@/hooks/Routes";
import ThemeToggler from "@/components/buttons/ThemeToggler";
import LangToggler from "@/components/buttons/LangToggler";
const HeaderBar = () => {
  const { user } = useAuth();
  const items = useProfileLinks();
  return (
    <Header
      style={{ backgroundColor: theme.useToken().token.colorBgBlur }}
      className={headerStyle.header}
    >
      <ThemeToggler />
      <LangToggler />
      <Dropdown menu={{ items }} placement="bottomRight">
        <Avatar src={user?.image}>
          {user?.firstname.charAt(0).toUpperCase()}
        </Avatar>
      </Dropdown>
    </Header>
  );
};

export default HeaderBar;
