import "@ant-design/v5-patch-for-react-19";
import { createRoot } from "react-dom/client";
import AuthProvider from "@/providers/auth/authProvider";
import "antd/dist/reset.css";
import "@/css/app.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/configs/axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppRoutes } from "@/routes/routes";
import { ConfigProvider, theme } from "antd";
import { darkColorsTheme, lightColorsTheme } from "./css";
import { isDarkTheme } from "./utils/theme";
import "@/i18n";

const queryClient = new QueryClient();
const router = createBrowserRouter(AppRoutes);
const is_dark = isDarkTheme();
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <ConfigProvider
      theme={{
        token: is_dark ? darkColorsTheme : lightColorsTheme,
        algorithm: is_dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ConfigProvider>
  </QueryClientProvider>
);
