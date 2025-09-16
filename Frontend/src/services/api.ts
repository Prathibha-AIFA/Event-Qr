import axios from "axios";

const API_URL = "https://event-qr-backend.onrender.com/api";

export const registerUser = (data: any) => axios.post(`${API_URL}/auth/register`, data);
export const registerGoogle = (data: any) => axios.post(`${API_URL}/auth/google`, data);
export const getTicket = (userId: string) => axios.get(`${API_URL}/ticket/${userId}`);
export const getEvent = () => axios.get(`${API_URL}/event`);
