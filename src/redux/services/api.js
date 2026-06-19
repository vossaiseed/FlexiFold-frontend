import axios from "axios";
import { BASE_URL } from "../../utils/api";
import { getCookie } from "../../utils/cookies";

// Shared axios instance used by every slice.
const api = axios.create({ baseURL: BASE_URL });

// Ensure cookies (including the httpOnly session cookie) are sent with requests.
api.defaults.withCredentials = true;

// Attach the auth token to every request. The session cookie is httpOnly (so
// JS can't read it), so we read the access token persisted in localStorage by
// the auth slice and send it as a Bearer header — auth-required endpoints
// (e.g. /settings) accept either the cookie or this header.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token") || getCookie("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Turn an axios error into a readable message for the UI.
export const getApiError = (error) =>
  error.response?.data?.message || error.message || "Something went wrong";

export default api;
