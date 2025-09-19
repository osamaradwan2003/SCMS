import type { LoginResponse, VerifyTokenResponse } from "@/@types/auth";
import axios, { type AxiosResponse } from "axios";

export function login(
  username: string,
  password: string
): Promise<AxiosResponse<LoginResponse>> {
  return axios.post("/auth/login", {
    username,
    password,
  });
}

export function vrifyToken(): Promise<AxiosResponse<VerifyTokenResponse>> {
  return axios.post("auth/me");
}

export function changePassword(currentPassword: string, newPassword: string) {
  return axios.post("/auth/change-password", { currentPassword, newPassword });
}

export function updateProfile(payload: {
  name?: string;
  username?: string;
  email?: string;
  phone?: string;
  image?: string;
}) {
  return axios.post("/auth/update-profile", payload);
}
