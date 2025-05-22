import { Link } from "react-router-dom";
import {
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  BookOutlined,
  FileTextOutlined,
  SolutionOutlined,
  CalendarOutlined,
  BankOutlined,
  DollarOutlined,
  MessageOutlined,
  SettingOutlined,
  UnorderedListOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useTranslate } from "./locales";

export function useProfileLinks() {
  return [
    {
      key: "1",
      label: <Link to="/auth/logout">Logout</Link>,
      icon: <LogoutOutlined />,
    },
    {
      key: "2",
      label: <Link to={`user/me`}>Profile</Link>,
      icon: <UserOutlined />,
    },
  ];
}

export function useSidebarLinks() {
  const t = useTranslate("sidebar");

  const crudChildren = (base: string) => [
    {
      key: `/${base}`,
      icon: <UnorderedListOutlined />,
      label: <Link to={`/${base}`}>{t("list")}</Link>,
    },
    {
      key: `/${base}/create`,
      icon: <PlusOutlined />,
      label: <Link to={`/${base}/create`}>{t("create")}</Link>,
    },
  ];

  return [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: <Link to="/">{t("dashboard")}</Link>,
    },
    {
      key: "students",
      icon: <TeamOutlined />,
      label: t("students"),
      children: crudChildren("students"),
    },
    {
      key: "guardians",
      icon: <UserOutlined />,
      label: t("guardians"),
      children: crudChildren("guardians"),
    },
    {
      key: "classes",
      icon: <BookOutlined />,
      label: t("classes"),
      children: crudChildren("classes"),
    },
    {
      key: "subjects",
      icon: <BookOutlined />,
      label: t("subjects"),
      children: crudChildren("subjects"),
    },
    {
      key: "weeklyReports",
      icon: <FileTextOutlined />,
      label: t("weeklyReports"),
      children: crudChildren("weekly-reports"),
    },
    {
      key: "employees",
      icon: <SolutionOutlined />,
      label: t("employees"),
      children: crudChildren("employees"),
    },
    {
      key: "attendance",
      icon: <CalendarOutlined />,
      label: t("attendance"),
      children: crudChildren("attendance"),
    },
    {
      key: "payroll",
      icon: <DollarOutlined />,
      label: t("payroll"),
      children: crudChildren("payroll"),
    },
    {
      key: "transactions",
      icon: <DollarOutlined />,
      label: t("transactions"),
      children: crudChildren("transactions"),
    },
    {
      key: "categories",
      icon: <BookOutlined />,
      label: t("categories"),
      children: crudChildren("categories"),
    },
    {
      key: "banks",
      icon: <BankOutlined />,
      label: t("banks"),
      children: crudChildren("banks"),
    },
    {
      key: "messages",
      icon: <MessageOutlined />,
      label: t("messages"),
      children: crudChildren("messages"),
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: <Link to="/settings">{t("settings")}</Link>,
    },
  ];
}
