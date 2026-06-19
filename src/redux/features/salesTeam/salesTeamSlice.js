import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { getApiError } from "../../services/api";

// All sales-team endpoints live under /sales-team
const ST_URL = "/sales-team";

// Supabase rows use `id`; tolerate a legacy `_id` just in case.
const getStaffId = (s) => s?.id ?? s?._id;

/* ============================================================
 * Async thunks
 * ============================================================ */

// GET /sales-team — load every sales staff member
export const fetchSalesTeam = createAsyncThunk(
  "salesTeam/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(ST_URL);
      return data.data ?? data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// POST /sales-team — create a sales staff member
export const createSalesStaff = createAsyncThunk(
  "salesTeam/create",
  async (newStaff, { rejectWithValue }) => {
    try {
      const { data } = await api.post(ST_URL, newStaff);
      return data.data ?? data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// PUT /sales-team/:id — update a sales staff member
export const updateSalesStaff = createAsyncThunk(
  "salesTeam/update",
  async ({ staffId, changes }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`${ST_URL}/${staffId}`, changes);
      return data.data ?? data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// PUT /sales-team/:id/reset-password — admin sets a new login password
export const resetSalesStaffPassword = createAsyncThunk(
  "salesTeam/resetPassword",
  async ({ staffId, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`${ST_URL}/${staffId}/reset-password`, { password });
      return data.data ?? data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// DELETE /sales-team/:id — remove a sales staff member
export const deleteSalesStaff = createAsyncThunk(
  "salesTeam/delete",
  async (staffId, { rejectWithValue }) => {
    try {
      await api.delete(`${ST_URL}/${staffId}`);
      return staffId; // return id so we can drop it from state
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

/* ============================================================
 * Slice
 * ============================================================ */

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const salesTeamSlice = createSlice({
  name: "salesTeam",
  initialState,
  reducers: {
    clearSalesTeamError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalesTeam.fulfilled, (state, action) => {
        state.items = action.payload || [];
      })
      .addCase(createSalesStaff.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateSalesStaff.fulfilled, (state, action) => {
        const updated = action.payload;
        const updatedId = getStaffId(updated);
        state.items = state.items.map((s) =>
          getStaffId(s) === updatedId ? { ...s, ...updated } : s
        );
      })
      .addCase(resetSalesStaffPassword.fulfilled, (state, action) => {
        const updated = action.payload;
        const updatedId = getStaffId(updated);
        state.items = state.items.map((s) =>
          getStaffId(s) === updatedId ? { ...s, ...updated } : s
        );
      })
      .addCase(deleteSalesStaff.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => getStaffId(s) !== action.payload);
      })
      // shared loading / error handling for every salesTeam thunk
      .addMatcher(
        (action) => action.type.startsWith("salesTeam/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("salesTeam/") && action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("salesTeam/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error?.message;
        }
      );
  },
});

export const { clearSalesTeamError } = salesTeamSlice.actions;

export const selectSalesTeam = (state) => state.salesTeam.items;
export const selectSalesTeamLoading = (state) => state.salesTeam.loading;
export const selectSalesTeamError = (state) => state.salesTeam.error;

export default salesTeamSlice.reducer;
