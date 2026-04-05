import { useContext } from "react";
import { AuthContext } from "../auth.context";
import { login, logout, register } from "../services/auth.api";

type LoginInput = {
  email: string;
  password: string;
};

type RegisterInput = {
  username: string;
  email: string;
  password: string;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  const { user, setUser, loading, setLoading } = context;

  const handleLogin = async ({ email, password }: LoginInput) => {
    try {
      setLoading(true);
      const data = await login({ email, password });
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({
    username,
    email,
    password,
  }: RegisterInput) => {
    try {
      setLoading(true);
      const data = await register({ username, email, password });
      setUser(data.user);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, handleRegister, handleLogin, handleLogout };
};
