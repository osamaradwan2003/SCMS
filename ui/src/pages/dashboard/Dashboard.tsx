import { useAuth } from "@/hooks/auth";
import { useTranslate } from "@/hooks/locales";
import { Typography } from "antd";

export default function DashBoard() {
  const t = useTranslate();
  const { user } = useAuth();
  return (
    <Typography.Title className="padding-1 text-center">
      {t("index:welcome")}, {user?.name}
    </Typography.Title>
  );
}
