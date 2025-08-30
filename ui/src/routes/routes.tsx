import { Navigate, type RouteObject } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import { lazy } from "react";

const Dashboard = lazy(() => import("@pages/dashboard/Dashboard"));

//student pages
const CreateStudent = lazy(() => import("@pages/student/Create"));

//auth pages
const Login = lazy(() => import("@/pages/auth/Login"));
const Logout = lazy(() => import("@/pages/auth/Logout"));

const AppRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "", element: <Navigate to="login" />, index: true },
    ],
  },
  {
    path: "/auth/logout",
    element: <Logout />,
  },
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { path: "", element: <Dashboard />, index: true },
      {
        path: "students",
        children: [
          { path: "", element: <>list</>, index: true },
          { path: "create", element: <CreateStudent /> },
          { path: ":id/edit", element: <>update</> },
          { path: ":id", element: <>view</> },
        ],
      },
      {
        path: "guardians",
        children: [
          { path: "", element: <div>Guardian List</div> },
          { path: "create", element: <div>Create Guardian</div> },
          { path: ":id/edit", element: <div>Edit Guardian</div> },
          { path: ":id", element: <div>View Guardian</div> },
        ],
      },
      {
        path: "classes",
        children: [
          { path: "", element: <div>Class List</div> },
          { path: "create", element: <div>Create Class</div> },
          { path: ":id/edit", element: <div>Edit Class</div> },
          { path: ":id", element: <div>View Class</div> },
        ],
      },
      {
        path: "subjects",
        children: [
          { path: "", element: <div>Subject List</div> },
          { path: "create", element: <div>Create Subject</div> },
          { path: ":id/edit", element: <div>Edit Subject</div> },
          { path: ":id", element: <div>View Subject</div> },
        ],
      },
      {
        path: "weekly-reports",
        children: [
          { path: "", element: <div>Weekly Report List</div> },
          { path: "create", element: <div>Create Weekly Report</div> },
          { path: ":id/edit", element: <div>Edit Weekly Report</div> },
          { path: ":id", element: <div>View Weekly Report</div> },
        ],
      },
      {
        path: "employees",
        children: [
          { path: "", element: <div>Employee List</div> },
          { path: "create", element: <div>Create Employee</div> },
          { path: ":id/edit", element: <div>Edit Employee</div> },
          { path: ":id", element: <div>View Employee</div> },
        ],
      },
      {
        path: "attendance",
        children: [
          { path: "", element: <div>Attendance List</div> },
          { path: "create", element: <div>Mark Attendance</div> },
          { path: ":id", element: <div>View Attendance</div> },
        ],
      },
      {
        path: "payroll",
        children: [
          { path: "", element: <div>Payroll List</div> },
          { path: "create", element: <div>Create Payroll</div> },
          { path: ":id/edit", element: <div>Edit Payroll</div> },
          { path: ":id", element: <div>View Payroll</div> },
        ],
      },
      {
        path: "transactions",
        children: [
          { path: "", element: <div>Transaction List</div> },
          { path: "create", element: <div>Create Transaction</div> },
          { path: ":id/edit", element: <div>Edit Transaction</div> },
          { path: ":id", element: <div>View Transaction</div> },
        ],
      },
      {
        path: "categories",
        children: [
          { path: "", element: <div>Category List</div> },
          { path: "create", element: <div>Create Category</div> },
          { path: ":id/edit", element: <div>Edit Category</div> },
          { path: ":id", element: <div>View Category</div> },
        ],
      },
      {
        path: "banks",
        children: [
          { path: "", element: <div>Bank List</div> },
          { path: "create", element: <div>Create Bank</div> },
          { path: ":id/edit", element: <div>Edit Bank</div> },
          { path: ":id", element: <div>View Bank</div> },
        ],
      },
      {
        path: "messages",
        children: [
          { path: "", element: <div>Message List</div> },
          { path: "create", element: <div>Send Message</div> },
          { path: ":id", element: <div>Message Details</div> },
        ],
      },
      {
        path: "user/me",
        element: <div>User Profile</div>,
      },
      {
        path: "settings",
        element: <div>Settings</div>,
      },
    ],
  },
];

export default AppRoutes;
