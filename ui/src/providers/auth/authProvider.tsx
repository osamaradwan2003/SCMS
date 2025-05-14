import type { User } from "@/@types";
import { useState } from "react";
import { AuthContext } from "./authContext";
import { isValidToken } from "@/hooks/auth";
import { saveInLocalStoreg, setCookie } from "@/utils";
import { TOKEN_KEY } from "@/utils/contstance";
import { login as API_LOGIN } from "@/api/auth";

const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [token, setToken] = useState<string | undefined>();

  const login = (username: string, password: string) => {
    setLoading(true);
    API_LOGIN(username, password)
      .then((data) => data.data)
      .then((data) => {
        setError(null);
        setHasError(false);
        setToken(data.token);
        setUser(data.user);
        saveInLocalStoreg(TOKEN_KEY, data.token);
        setCookie(TOKEN_KEY, data.token, 24);
        setIsLogin(true);
      })
      .catch((error) => {
        setError(error);
        setHasError(true);
      })
      .finally(() => {
        setLoading(false);
      });
    // const { error, isLoading, user, token, isError } = useLogin(
    //   username,
    //   password
    // );
    // setError(error);
    // setLoading(isLoading);
    // setUser(user);
    // setToken(token);
    // setHasError(isError);
  };

  function logout() {
    //@todo
    // implement logout
    return true;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLogin,
        loading,
        error,
        hasError,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
