import { useContext } from "react";
import { AuthContext } from "@/providers/auth/authContext";
import { login } from "@/api/auth";
import type { AxiosResponse } from "axios";
import type { LoginResponse } from "@/@types";
import { useMutation } from "@tanstack/react-query";
import { message } from "antd";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const useLogin = () => {
  const { login: UpdateLoginContext } = useAuth();
  return useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => login(username, password),
    onSuccess: (data: AxiosResponse<LoginResponse>) => {
      UpdateLoginContext(data.data.user, data.data.token);
      message.info("Login Success");
    },
  });
};
