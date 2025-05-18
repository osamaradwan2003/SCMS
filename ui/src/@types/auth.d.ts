import { User } from "./user";

interface LoginResponse {
  token: string;
  user: User;
  message: string;
  status: number;
}

interface AuthContextType {
  user?: User;
  login: (user: User, token: string) => void;
  logout: () => boolean;
  isAuthenticated: boolean;
}

export interface VerifyTokenResponse {
  valid: boolean;
  message: string;
  user?: User;
}
