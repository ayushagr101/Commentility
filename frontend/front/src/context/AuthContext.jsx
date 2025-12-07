import React, { createContext, useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const userData = await authService.checkAuthStatus();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      const userData = await authService.signIn(email, password);
      
      if (!userData) {
        throw new Error("Login failed. Please try again.");
      }

      setUser(userData);
      setIsAuthenticated(true);
      toast.success("Welcome back!");
      return userData;
    } catch (err) {
      const errorMessage = 
        err.response?.status === 403
          ? "Please verify your email before logging in"
          : err.response?.status === 400
          ? "Invalid email or password"
          : err.message || "Unable to sign in. Please try again later";
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      await authService.signUp(email, password);
      toast.success("Verification link sent to your email. Please check your inbox.");
      return true;
    } catch (err) {
      console.error("Signup error:", err);
      console.error("Error response:", err.response);
      const errorMessage = err.response?.data?.message || err.message || "Signup failed";
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Forgot password function
  const forgotPasswordFn = async (email) => {
    try {
      setLoading(true);
      setError(null);
      const message = await authService.forgotPassword(email);
      toast.success(message || "Password reset instructions sent to your email!");
      return message;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Password reset failed";
      setError(errorMessage);
      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logoutFn = async () => {
    try {
      setLoading(true);
      await authService.logout();
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully");
    } catch (err) {
      const errorMessage = "Unable to logout. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Refresh auth status
  const refreshAuth = async () => {
    try {
      const userData = await authService.checkAuthStatus();
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error("Failed to refresh auth:", err);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    signup,
    forgotPassword: forgotPasswordFn,
    logout: logoutFn,
    clearError,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
