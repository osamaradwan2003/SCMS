import { Card, Descriptions, Button } from "antd";
import { useAuth } from "@/hooks/auth";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useAuth();
  const nav = useNavigate();

  if (!user) return null;

  return (
    <div className="p-6">
      <Card
        title="My Profile"
        extra={<Button type="primary" onClick={() => nav("/user/me/edit")}>Edit Profile</Button>}
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Name" span={2}>
            {user.name}
          </Descriptions.Item>
          <Descriptions.Item label="Username">{user.username}</Descriptions.Item>
          {user.email && <Descriptions.Item label="Email">{user.email}</Descriptions.Item>}
          <Descriptions.Item label="Roles" span={2}>
            {(() => {
              const multi = (user.roles || []).map((r) => r.name).filter(Boolean);
              if (multi.length > 0) return multi.join(", ");
              if (typeof user.role === "string") return user.role;
              if (user.role && typeof user.role === "object") return user.role.name;
              return "-";
            })()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At" span={2}>
            {dayjs().format("YYYY-MM-DD HH:mm")} {/* client-side placeholder */}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
}
