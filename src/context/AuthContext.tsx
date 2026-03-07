import { createContext, useContext, useMemo, useState } from "react";

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  loginUser: (token: string) => void;
  logoutUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const loginUser = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: !!token,
      loginUser,
      logoutUser,
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}