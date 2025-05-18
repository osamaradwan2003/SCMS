import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAuth } from "./auth";

export function useProfileLinks() {
  const { user } = useAuth();
  return [
    {
      key: "1",
      label: <Link to="/auth/logout">Logout</Link>,
      icon: <LogoutOutlined />,
    },
    {
      key: "2",
      label: <Link to={`user/${user?.id}`}>Profile</Link>,
      icon: <UserOutlined />,
    },
  ];
}
