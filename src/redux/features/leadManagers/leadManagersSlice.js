import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../../utils/api";

const API_URL =
  `${BASE_URL}/lead-managers`;

// Fetch all lead managers from the backend (GET /api/lead-managers).
export const fetchLeadManagers = createAsyncThunk(
  "leadManagers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(API_URL);
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Failed to fetch lead managers");
      return body.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const leadManagersSlice = createSlice({
  name: "leadManagers",
  initialState,
  reducers: {
    clearLeadManagersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeadManagers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadManagers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchLeadManagers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearLeadManagersError } = leadManagersSlice.actions;
export default leadManagersSlice.reducer;
