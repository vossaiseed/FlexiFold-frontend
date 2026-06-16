import { createSlice } from "@reduxjs/toolkit";
import { getCookie, setCookie, removeCookie } from "../../../utils/cookies";

// Rehydrate auth so a page refresh keeps the user signed in.
// Token lives in a cookie; the user object stays in localStorage.
const storedUser = localStorage.getItem("user");
const storedToken = getCookie("token");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Save the logged-in user + access token (call after login/register).
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      setCookie("token", action.payload.token ?? "");
    },
    // Clear auth state on logout.
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      removeCookie("token");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
