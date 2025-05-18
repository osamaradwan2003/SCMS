import type { RouteObject } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import AuthLayout from "@/layouts/AuthLayout";
import { lazy } from "react";

const DashBoard = lazy(() => import("@pages/dashboard/Dashboard"));

//auth pages
const Login = lazy(() => import("@/pages/auth/Login"));

export const AppRoutes: RouteObject[] = [
  {
    path: "/",

    element: <MainLayout />,
    children: [
      {
        path: "dashboard",
        element: <DashBoard />,
        index: true,
      },
    ],
  },
  {
    path: "auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "logout",
      },
    ],
  },
];
