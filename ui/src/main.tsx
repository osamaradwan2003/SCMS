import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AuthProvider from "@/providers/auth/authProvider";
import "antd/dist/reset.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/configs/axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AppRoutes } from "@/routes/routes";
const queryClient = new QueryClient();
const router = createBrowserRouter(AppRoutes);
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router}></RouterProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
