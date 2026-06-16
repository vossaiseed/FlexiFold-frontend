import axios from "axios";
import { BASE_URL } from "../../utils/api";
import { getCookie } from "../../utils/cookies";

// Shared axios instance used by every slice.
const api = axios.create({ baseURL: BASE_URL });

// Attach the auth token (stored in a cookie) to every outgoing request.
api.interceptors.request.use((config) => {
  const token = getCookie("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Turn an axios error into a readable message for the UI.
export const getApiError = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

export default api;
