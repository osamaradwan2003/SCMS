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
