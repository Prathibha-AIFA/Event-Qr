import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
});

// Modified registerUser to support Google OAuth
export const registerUser = async (data: any) => {
  if (data.googleToken) {
    // Google registration
    const res = await api.post("/api/auth/google-login", { token: data.googleToken });
    return res.data;
  } else {
    // Manual registration
    const res = await api.post("/api/auth/register", data);
    return res.data;
  }
};

// Other APIs remain unchanged
export const getTicket = (id: string) => api.get(`/api/tickets/${id}`);

export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await api.post("/api/auth/adminlogin", { email, password });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.msg || "Login failed";
  }
};

export const fetchAllUsers = async () => {
  const res = await api.get("/api/admin/users");
  return res.data;
};

export const fetchUsersForResend = async () => {
  const res = await api.get("/api/admin/resend");
  return res.data;
};

export const resendEmail = async (userId: string) => {
  const res = await api.post(`/api/admin/resend/${userId}`);
  return res.data; 
};

export type DashboardCounts = {
  totalUsers: number;
  totalTickets: number;
};

export const getDashboardCounts = async (): Promise<DashboardCounts> => {
  const res = await api.get("/api/admin/dashboard");
  return res.data;
};
