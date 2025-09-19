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
  ApartmentOutlined,
} from "@ant-design/icons";
import { useTranslate } from "./locales";
import { useAuth } from "@/hooks/auth";
import { hasPermission } from "@/utils/permissions";
import type { AppModel } from "@/@types/user";
import type { MenuProps } from "antd";

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
  const { user } = useAuth();
  // Strict mode: rely on hasPermission() only. No fallback to show all.

  const crudChildren = (base: string, model: AppModel): MenuProps["items"] => {
    const items: MenuProps["items"] = [];
    // List (view)
    if (hasPermission(user, model, "view")) {
      items.push({
        key: `/${base}`,
        icon: <UnorderedListOutlined />,
        label: <Link to={`/${base}`}>{t("list")}</Link>,
      });
    }
    // Create
    if (hasPermission(user, model, "create")) {
      items.push({
        key: `/${base}/create`,
        icon: <PlusOutlined />,
        label: <Link to={`/${base}/create`}>{t("create")}</Link>,
      });
    }
    return items;
  };

  // If user is superadmin or has no permissions data, we will still attempt to use hasPermission
  // which grants full access for superadmin or compute from roles. Items with no permitted actions are hidden.
  const items = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: <Link to="/">{t("dashboard")}</Link>,
    },
    {
      key: "students",
      icon: <TeamOutlined />,
      label: t("students"),
      children: crudChildren("students", "Student"),
    },
    {
      key: "guardians",
      icon: <UserOutlined />,
      label: t("guardians"),
      children: crudChildren("guardians", "Guardian"),
    },
    {
      key: "classes",
      icon: <BookOutlined />,
      label: t("classes"),
      children: crudChildren("classes", "Class"),
    },
    {
      key: "subjects",
      icon: <BookOutlined />,
      label: t("subjects"),
      children: crudChildren("subjects", "Subject"),
    },
    {
      key: "weeklyReports",
      icon: <FileTextOutlined />,
      label: t("weeklyReports"),
      children: crudChildren("weekly-reports", "WeeklyReport"),
    },
    {
      key: "employees",
      icon: <SolutionOutlined />,
      label: t("employees"),
      children: crudChildren("employees", "Employee"),
    },
    {
      key: "departments",
      icon: <ApartmentOutlined />,
      label: t("departments"),
      children: crudChildren("departments", "Department"),
    },
    {
      key: "attendance",
      icon: <CalendarOutlined />,
      label: t("attendance"),
      // Attendance is composite: show if user can view student or employee attendance; create usually not used here
      children:
        hasPermission(user, "StuednAttendance", "view") ||
        hasPermission(user, "EmployeeAttendance", "view")
          ? [
              {
                key: `/attendance`,
                icon: <UnorderedListOutlined />,
                label: <Link to={`/attendance`}>{t("list")}</Link>,
              },
            ]
          : [],
    },
    {
      key: "payroll",
      icon: <DollarOutlined />,
      label: t("payroll"),
      children: crudChildren("payroll", "Payroll"),
    },
    {
      key: "Transaction",
      icon: <DollarOutlined />,
      label: t("Transaction"),
      children: crudChildren("Transaction", "Transaction"),
    },
    {
      key: "categories",
      icon: <BookOutlined />,
      label: t("categories"),
      children: crudChildren("categories", "Category"),
    },
    {
      key: "banks",
      icon: <BankOutlined />,
      label: t("banks"),
      children: crudChildren("banks", "Bank"),
    },
    {
      key: "messages",
      icon: <MessageOutlined />,
      label: t("messages"),
      children: crudChildren("messages", "MessageLog"),
    },
    {
      key: "subscriptions",
      icon: <DollarOutlined />,
      label: t("subscriptions"),
      children: crudChildren("subscriptions", "Subscriptions"),
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: <Link to="/settings">{t("settings")}</Link>,
    },
  ];

  // Filter out groups with no children (no permitted actions) except Dashboard and Settings (always visible)
  const shaped = items.map((it) => ({
    ...it,
    children: Array.isArray(it.children) ? it.children : undefined,
  }));

  // Only return modules the user can access: keep Dashboard and Settings, and any item with at least one permitted child
  return shaped.filter(
    (it) => it.key === "/" || it.key === "/settings" || (it.children && it.children.length > 0)
  );
}
