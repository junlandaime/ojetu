import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get("/api/auth/session");
        if (response.data?.success) {
          setUser(response.data.data.user);
        } else {
          setUser(null);
        }
         } catch (error) {
        if (error.response?.status === 401) {
          console.info("Auth session: not authenticated yet (401)");
        } else {
          console.error("Auth check error:", error);
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password, isAdmin = false) => {
    try {
      const endpoint = isAdmin ? "/api/auth/admin/login" : "/api/auth/login";
      const payload = isAdmin
        ? { username: email, password }
        : { email, password };

      const response = await axios.post(endpoint, payload);

      if (response.data.success) {
        const { user: userData } = response.data.data;
        setUser(userData);
        return { success: true, user: userData };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post("/api/auth/register", userData);

      if (response.data.success) {
        const payload = response.data.data;
        if (payload?.user) {
          setUser(payload.user);
          return { success: true, user: payload.user };
        }

        return {
          success: true,
          message:
            response.data.message ||
            "Registrasi berhasil. Silakan cek email Anda untuk verifikasi.",
        };
      }
      
      return {
        success: false,
        message: response.data.message || "Registrasi gagal",
      };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Registration failed";
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.user_type === "admin" || user?.role === "admin",
    isParticipant: user?.user_type === "participant",
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};