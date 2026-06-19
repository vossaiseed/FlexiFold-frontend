import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { getApiError } from "../../services/api";

const CONV_URL = "/conversions";

const getConvId = (c) => c?.id ?? c?._id;

/* ============================================================
 * Async thunks
 * ============================================================ */

// GET /conversions — load every conversion request
export const fetchConversions = createAsyncThunk(
  "conversions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(CONV_URL);
      return data.data ?? data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// POST /conversions — create a conversion request (e.g. from "Convert Lead")
export const createConversion = createAsyncThunk(
  "conversions/create",
  async (newConversion, { rejectWithValue }) => {
    try {
      const { data } = await api.post(CONV_URL, newConversion);
      return data.data ?? data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// PUT /conversions/:id — update a conversion (e.g. approve / reject)
export const updateConversion = createAsyncThunk(
  "conversions/update",
  async ({ id, changes }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`${CONV_URL}/${id}`, changes);
      return data.data ?? data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// DELETE /conversions/:id — remove a conversion
export const deleteConversion = createAsyncThunk(
  "conversions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${CONV_URL}/${id}`);
      return id;
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
      .addCase(fetchConversions.fulfilled, (state, action) => {
        state.items = action.payload || [];
      })
      .addCase(createConversion.fulfilled, (state, action) => {
        if (action.payload) state.items.unshift(action.payload);
      })
      .addCase(updateConversion.fulfilled, (state, action) => {
        const updated = action.payload;
        const updatedId = getConvId(updated);
        // The PUT response isn't enriched with names; merge so we keep them.
        state.items = state.items.map((c) =>
          getConvId(c) === updatedId ? { ...c, ...updated } : c
        );
      })
      .addCase(deleteConversion.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => getConvId(c) !== action.payload);
      })
      .addMatcher(
        (action) => action.type.startsWith("conversions/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("conversions/") && action.type.endsWith("/fulfilled"),
        (state) => {
          state.loading = false;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("conversions/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload || action.error?.message;
        }
      );
  },
});

export const { clearConversionsError } = conversionsSlice.actions;

export const selectConversions = (state) => state.conversions.items;
export const selectConversionsLoading = (state) => state.conversions.loading;
export const selectConversionsError = (state) => state.conversions.error;

export default conversionsSlice.reducer;
