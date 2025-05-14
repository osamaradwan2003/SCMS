import { User } from "./user";

interface LoginResponse {
  token: string;
  user: User;
  message: string;
  status: number;
}

interface AuthContextType {
  user?: User;
  login: (username: string, password: string) => void;
  logout: () => boolean;
  isLogin: boolean;
  loading: boolean;
  hasError: boolean;
  error: Error | null;
  token?: string;
}

export interface VerifyTokenResponse {
  token: string;
  valid: boolean;
}
