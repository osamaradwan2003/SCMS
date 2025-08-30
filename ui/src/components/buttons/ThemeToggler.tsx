import { isDarkTheme, toggleTheme } from "@/utils/theme";
import { Button } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";

const ThemeToggler: React.FC = () => {
  const is_dark = isDarkTheme();
  const theme_icon = is_dark ? <MoonOutlined /> : <SunOutlined />;
  return <Button icon={theme_icon} onClick={toggleTheme} />;
};

export default ThemeToggler;
