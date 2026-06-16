import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../../utils/api";

const API_URL =
 `${BASE_URL}/conversions`;

// Fetch all conversions from the backend (GET /api/conversions).
export const fetchConversions = createAsyncThunk(
  "conversions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(API_URL);
      const body = await res.json();
      if (!res.ok) throw new Error(body.message || "Failed to fetch conversions");
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

const conversionsSlice = createSlice({
  name: "conversions",
  initialState,
  reducers: {
    clearConversionsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchConversions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearConversionsError } = conversionsSlice.actions;
export default conversionsSlice.reducer;
