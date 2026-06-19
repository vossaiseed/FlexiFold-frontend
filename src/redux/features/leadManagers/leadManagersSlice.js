import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { getApiError } from "../../services/api";

// All lead-manager endpoints live under /lead-managers
const LM_URL = "/lead-managers";

// Supabase rows use `id`; tolerate a legacy `_id` just in case.
const getManagerId = (m) => m?.id ?? m?._id;

/* ============================================================
 * Async thunks
 * ============================================================ */

// GET /lead-managers — load every lead manager
export const fetchLeadManagers = createAsyncThunk(
  "leadManagers/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(LM_URL);
      return data.data ?? data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// POST /lead-managers — create a lead manager
export const createLeadManager = createAsyncThunk(
  "leadManagers/create",
  async (newManager, { rejectWithValue }) => {
    try {
      const { data } = await api.post(LM_URL, newManager);
      return data.data ?? data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// PUT /lead-managers/:id — update a lead manager
export const updateLeadManager = createAsyncThunk(
  "leadManagers/update",
  async ({ managerId, changes }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`${LM_URL}/${managerId}`, changes);
      return data.data ?? data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// DELETE /lead-managers/:id — remove a lead manager
export const deleteLeadManager = createAsyncThunk(
  "leadManagers/delete",
  async (managerId, { rejectWithValue }) => {
    try {
      await api.delete(`${LM_URL}/${managerId}`);
      return managerId; // return id so we can drop it from state
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
      .addCase(fetchLeadManagers.fulfilled, (state, action) => {
        state.items = action.payload || [];
      })
      .addCase(createLeadManager.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateLeadManager.fulfilled, (state, action) => {
        const updated = action.payload;
        const updatedId = getManagerId(updated);
        state.items = state.items.map((m) =>
          getManagerId(m) === updatedId ? { ...m, ...updated } : m
        );
      })
      .addCase(deleteLeadManager.fulfilled, (state, action) => {
        state.items = state.items.filter((m) => getManagerId(m) !== action.payload);
      })
      // shared loading / error handling for every leadManagers thunk
      .addMatcher(
        (action) => action.type.startsWith("leadManagers/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("leadManagers/") && action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("leadManagers/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error?.message;
        }
      );
  },
});

export const { clearLeadManagersError } = leadManagersSlice.actions;

export const selectLeadManagers = (state) => state.leadManagers.items;
export const selectLeadManagersLoading = (state) => state.leadManagers.loading;
export const selectLeadManagersError = (state) => state.leadManagers.error;

export default leadManagersSlice.reducer;
