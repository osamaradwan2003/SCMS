import { App, Button, Card, Typography } from "antd";
import { changePassword, vrifyToken } from "@/api/auth";
import { useAuth } from "@/hooks/auth";
import { useNavigate } from "react-router-dom";
import CreateForm from "@/components/Form/CreateForm";
import ChangePasswordForm from "@/forms/ChangePassword.sc";
import type { User } from "@/@types";
import { getFromLocalStorege } from "@/utils";
import { TOKEN_KEY } from "@/utils/contstance";

export default function ChangePasswordPage() {
  const nav = useNavigate();
  const { login, user } = useAuth();
  const { message } = App.useApp();

  const onFinish = async (values: { currentPassword: string; newPassword: string; confirmNewPassword: string }) => {
    if (values.newPassword !== values.confirmNewPassword) {
      message.error("Passwords do not match");
      return;
    }
    try {
      await changePassword(values.currentPassword, values.newPassword);
      message.success("Password changed successfully");
      // Refresh user data to clear firstLogin/mustChangePassword flags
      const res = await vrifyToken();
      const existingToken = (getFromLocalStorege(TOKEN_KEY) as string) || "";
      login(res.data.user as User, existingToken);
      nav("/", { replace: true });
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } }; message?: string };
      message.error(err?.response?.data?.message || err?.message || "Failed to change password");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <Card style={{ width: 420 }}>
        <Typography.Title level={3} style={{ textAlign: "center" }}>
          Change Password
        </Typography.Title>
        <Typography.Paragraph style={{ textAlign: "center" }}>
          {user?.firstLogin || user?.mustChangePassword
            ? "Please set a new password to continue"
            : "Update your password"}
        </Typography.Paragraph>
        <CreateForm formSchema={ChangePasswordForm} layout="vertical" onFinish={onFinish}>
          <Button type="primary" htmlType="submit" block>
            Save Password
          </Button>
        </CreateForm>
      </Card>
    </div>
  );
}
