import { Layout, Avatar, Dropdown } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "@/hooks/auth";
import { Link } from "react-router-dom";
const { Header } = Layout;

const HeaderBar = () => {
  const { user, logout } = useAuth();

  const items = [
    {
      key: "1",
      label: <span onClick={logout}>Logout</span>,
      icon: <LogoutOutlined />,
    },
    {
      key: "2",
      label: <Link to={`user/${user?.id}`}>Profile</Link>,
      icon: <UserOutlined />,
    },
  ];

  return (
    <Header className="header">
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Dropdown menu={{ items }} placement="bottomRight">
          <Avatar src={user?.image} icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  );
};

export default HeaderBar;
