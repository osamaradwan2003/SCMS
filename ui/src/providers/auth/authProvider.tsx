import type { User } from "@/@types";
import { useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import {
  deleteFromLocalStorge,
  getFromLocalStorege,
  saveInLocalStoreg,
} from "@/utils";
import { LOGIN_PATH, TOKEN_KEY } from "@/utils/contstance";
import { vrifyToken } from "@/api/auth";
import { Navigate } from "react-router-dom";

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const isAuthenticated = user != undefined;
  // const navigate = useNavigate();

  useEffect(() => {
    const token = getFromLocalStorege(TOKEN_KEY);
    if (!token) return;
    vrifyToken()
      .then((res) => res.data)
      .then((res) => {
        login(res.user as User, token);
      })
      .catch(() => {
        logout();
        Navigate({ to: LOGIN_PATH, replace: true });
      });
  }, []);

  const login = (user: User, token: string) => {
    setUser(user);
    if (token) {
      saveInLocalStoreg(TOKEN_KEY, token);
    }
  };

  const logout = () => {
    deleteFromLocalStorge(TOKEN_KEY);
    setUser(undefined);
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
