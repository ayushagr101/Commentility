import axios from "axios";

// Configure axios instance with credentials
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for handling 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthEndpoint =
      error.config?.url?.includes("/users/login") ||
      error.config?.url?.includes("/users/signup") ||
      error.config?.url?.includes("/users/current");

    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Redirect to login if unauthorized
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Check current authentication status
export const checkAuthStatus = async () => {
  try {
    const response = await api.get("/users/current");
    return response.data.data.user || null;
  } catch (error) {
    return null;
  }
};

// Sign in user
export const signIn = async (email, password) => {
  const response = await api.post("/users/login", { email, password });
  return response.data.data.user;
};

// Sign up new user
export const signUp = async (email, password) => {
  const response = await api.post("/users/signup", { email, password });
  return response.data;
};

// Forgot password
export const forgotPassword = async (email) => {
  const response = await api.post("/users/forgot-password", { email });
  return response.data.message;
};

// Reset password
export const resetPassword = async (token, newPassword) => {
  const response = await api.post("/users/reset-password", {
    token,
    newPassword,
  });
  return response.data.message;
};

// Verify email
export const verifyEmail = async (token) => {
  const response = await api.get(`/users/verify-email?token=${token}`);
  return response.data.data.user;
};

// Logout user
export const logout = async () => {
  await api.post("/users/logout");
};
