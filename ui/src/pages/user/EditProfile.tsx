import { App, Button, Card, Form, Input } from "antd";
import { useAuth } from "@/hooks/auth";
import { updateProfile, vrifyToken } from "@/api/auth";
import { useNavigate } from "react-router-dom";
import { TOKEN_KEY } from "@/utils/contstance";
import { getFromLocalStorege } from "@/utils";
import type { User } from "@/@types";

export default function EditProfilePage() {
  const { user, login } = useAuth();
  const nav = useNavigate();
  const { message } = App.useApp();
  const [form] = Form.useForm<{
    name?: string;
    username?: string;
    email?: string;
    phone?: string;
    image?: string;
  }>();

  const onFinish = async (values: {
    name?: string;
    username?: string;
    email?: string;
    phone?: string;
    image?: string;
  }) => {
    try {
      await updateProfile(values);
      message.success("Profile updated");
      const res = await vrifyToken();
      const existingToken = (getFromLocalStorege(TOKEN_KEY) as string) || "";
      login(res.data.user as User, existingToken);
      nav("/user/me", { replace: true });
    } catch (e: unknown) {
      const err = e as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      message.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update profile"
      );
    }
  };

  return (
    <div className="p-6" style={{ display: "flex", justifyContent: "center" }}>
      <Card title="Edit Profile" style={{ width: 520 }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            name: user?.name,
            username: user?.username,
            email: user?.email,
            phone: user?.phone,
            image: user?.image,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Name is required" }]}
          >
            <Input placeholder="Your name" />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input placeholder="Your username" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ type: "email", message: "Invalid email" }]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input placeholder="Phone" />
          </Form.Item>
          <Form.Item name="image" label="Image URL">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item>
            <div
              style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}
            >
              <Button onClick={() => nav(-1)}>Cancel</Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
