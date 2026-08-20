import React,{useState,useEffect} from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const AuthProvider = ({ children }) => {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem("token");
            const userData = localStorage.getItem("user");

            if (token && userData) {
                const response = await axios.get("/api/auth/check", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (response.data.success) {
                    setUser(JSON.parse(userData));
                    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                } else {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    delete axios.defaults.headers.common.Authorization;
                }
            }
        } catch (error) {
            console.error("Auth check error:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            delete axios.defaults.headers.common.Authorization;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email,password,isAdmin = false) => {
        try {
            const endpoint = isAdmin
                ? "/api/auth/admin/login"
                : "/api/auth/login";

            const response = await axios.post(endpoint,{
                email: isAdmin ? undefined : email,
                username: isAdmin ? email : undefined,
                password
            });

            if (response.data.success) {
                const { token,user: userData } = response.data.data;

                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(userData));

                axios.defaults.headers.common.Authorization = `Bearer ${token}`;

                setUser(userData);

                return {
                    success: true,
                    user: userData
                };
            }

            return {
                success: false,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Login failed"
            };
        }
    };

    const register = async (userData) => {
        try {
            const response = await axios.post(
                "/api/auth/register",
                userData
            );

            if (response.data.success) {
                const { token,user: newUser } =
                    response.data.data;

                localStorage.setItem("token", token);
                localStorage.setItem(
                    "user",
                    JSON.stringify(newUser)
                );

                axios.defaults.headers.common.Authorization =
                    `Bearer ${token}`;

                setUser(newUser);

                return {
                    success: true,
                    user: newUser
                };
            }

            return {
                success: false,
                message: response.data.message
            };
        } catch (error) {
            return {
                success: false,
                message:
                    error.response?.data?.message ||
                    "Registration failed"
            };
        }
    };

    const logout = async () => {
        try {
            await axios.post("/api/auth/logout");
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            delete axios.defaults.headers.common.Authorization;
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
        isAdmin:
            user?.user_type === "admin" ||
            user?.role === "admin",
        isParticipant:
            user?.user_type === "participant"
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;