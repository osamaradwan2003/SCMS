import { Image, Layout, Space, Typography } from "antd";

const { Sider } = Layout;

const SideBar: React.FC = () => {
  return (
    <>
      <Sider
        style={{ minHeight: "100vh", minWidth: "200px" }}
        collapsed={false}
      >
        <Space direction="vertical">
          <Image src="./vite.svg" />
          <Typography.Title level={2}>SCMS</Typography.Title>
        </Space>
      </Sider>
    </>
  );
};

export default SideBar;
