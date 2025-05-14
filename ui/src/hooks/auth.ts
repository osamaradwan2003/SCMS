import { useContext } from "react";
import { AuthContext } from "@/providers/auth/authContext";
import { login, vrifyToken } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const isValidToken = async () => {
  return (await vrifyToken()).data.valid;
};

export const useLogin = (username: string, password: string) => {
  const q = useQuery({
    queryKey: ["login"],
    queryFn: () => login(username, password),
  });
  return {
    error: q.error,
    isLoading: q.isLoading,
    user: q.data?.data.user,
    token: q.data?.data.token,
    isError: q.isError,
  };
};
