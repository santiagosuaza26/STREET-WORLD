"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authService } from "./api";

interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const bootstrap = async () => {
      const localUser = authService.getCurrentUser();
      if (localUser && isMounted) {
        setUser(localUser);
      }

      try {
        const me = await authService.me();
        if (isMounted) {
          setUser(me);
          authService.setCurrentUser(me);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          authService.setCurrentUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    const authUser = { id: response.id, email: response.email };
    authService.setCurrentUser(authUser);
    setUser(authUser);
  };

  const register = async (email: string, password: string) => {
    const response = await authService.register({ email, password });
    const authUser = { id: response.id, email: response.email };
    authService.setCurrentUser(authUser);
    setUser(authUser);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
