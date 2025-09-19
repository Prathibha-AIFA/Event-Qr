import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
});

// ✅ Register user (normal + Google OAuth)
export const registerUser = async (data: any) => {
  try {
    let res;
    if (data.googleToken) {
      res = await api.post("/api/auth/google-login", { token: data.googleToken });
    } else {
      res = await api.post("/api/auth/register", data);
    }
    console.log("registerUser received response:", res);
    return res.data;
  } catch (err: any) {
    console.error("registerUser error:", err.response || err.message);
    throw err;
  }
};

// ✅ Get ticket by ID
export const getTicket = (id: string) => api.get(`/api/tickets/${id}`);

// ✅ Admin login
export const loginAdmin = async (email: string, password: string) => {
  try {
    const response = await api.post("/api/auth/adminlogin", { email, password });
    return response.data;
  } catch (error: any) {
    throw error.response?.data?.msg || "Login failed";
  }
};

// ✅ Fetch all users (for Users section)
export const fetchAllUsers = async () => {
  const res = await api.get("/api/admin/users");
  return res.data;
};

// ✅ Fetch users for Resend Emails section
export const fetchUsersForResend = async () => {
  const res = await api.get("/api/admin/resend");
  return res.data;
};

// ✅ Resend email to specific user
export const resendEmail = async (userId: string) => {
  const res = await api.post(`/api/admin/resend/${userId}`);
  return res.data;
};

// ✅ Type for dashboard counts including QR scans
export type DashboardCounts = {
  totalUsers: number;
  totalTickets: number;
  totalScans: number;
};

// ✅ Fetch dashboard counts
export const getDashboardCounts = async (): Promise<DashboardCounts> => {
  const res = await api.get("/api/admin/dashboard");
  return res.data;
};

// ✅ Mark ticket as scanned (only once)
export const scanTicket = async (ticketId: string) => {
  const res = await api.post("/api/admin/scan", { ticketId });
  return res.data;
};
