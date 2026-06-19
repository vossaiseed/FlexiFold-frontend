import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { getApiError } from "../../services/api";

// All partner endpoints live under /partners
const PARTNERS_URL = "/partners";

// Supabase rows use `id`; tolerate a legacy `_id` just in case.
const getPartnerId = (partner) => partner?.id ?? partner?._id;

/* ============================================================
 * Async thunks — each talks to the backend for a single action.
 * The shared `api` client sends the auth cookie automatically.
 * ============================================================ */

// GET /partners — load every partner
export const fetchPartners = createAsyncThunk(
  "partners/fetchPartners",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(PARTNERS_URL);
      return data.data ?? data; // supports { data: [...] } or a raw array
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// GET /partners/:id — load a single partner
export const fetchPartnerById = createAsyncThunk(
  "partners/fetchPartnerById",
  async (partnerId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`${PARTNERS_URL}/${partnerId}`);
      return data.data ?? data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// GET /partners/:id/leads — leads belonging to a single partner
export const fetchPartnerLeads = createAsyncThunk(
  "partners/fetchPartnerLeads",
  async (partnerId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`${PARTNERS_URL}/${partnerId}/leads`);
      return data.data ?? data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// POST /partners — create a new partner
export const createPartner = createAsyncThunk(
  "partners/createPartner",
  async (newPartner, { rejectWithValue }) => {
    try {
      const { data } = await api.post(PARTNERS_URL, newPartner);
      return data.data ?? data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// PUT /partners/:id — update an existing partner
export const updatePartner = createAsyncThunk(
  "partners/updatePartner",
  async ({ partnerId, changes }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`${PARTNERS_URL}/${partnerId}`, changes);
      return data.data ?? data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// PUT /partners/:id/reset-password — admin sets a new login password
export const resetPartnerPassword = createAsyncThunk(
  "partners/resetPassword",
  async ({ partnerId, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`${PARTNERS_URL}/${partnerId}/reset-password`, { password });
      return data.data ?? data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// DELETE /partners/:id — remove a partner
export const deletePartner = createAsyncThunk(
  "partners/deletePartner",
  async (partnerId, { rejectWithValue }) => {
    try {
      await api.delete(`${PARTNERS_URL}/${partnerId}`);
      return partnerId; // return the id so we can drop it from state
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

/* ============================================================
 * Slice
 * ============================================================ */

const initialState = {
  partners: [], // the full list of partners
  selectedPartner: null, // the partner currently being viewed / edited
  partnerLeads: [], // leads for the partner currently being viewed
  isLoading: false, // true while any partners request is in flight
  error: null, // last error message, or null
};

const partnersSlice = createSlice({
  name: "partners",
  initialState,
  reducers: {
    clearSelectedPartner: (state) => {
      state.selectedPartner = null;
      state.partnerLeads = [];
    },
    clearPartnersError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- success handlers: update the data ---
      .addCase(fetchPartners.fulfilled, (state, action) => {
        state.partners = action.payload;
      })
      .addCase(fetchPartnerById.fulfilled, (state, action) => {
        state.selectedPartner = action.payload;
      })
      .addCase(fetchPartnerLeads.fulfilled, (state, action) => {
        state.partnerLeads = action.payload || [];
      })
      .addCase(createPartner.fulfilled, (state, action) => {
        state.partners.unshift(action.payload);
      })
      .addCase(updatePartner.fulfilled, (state, action) => {
        const updated = action.payload;
        const updatedId = getPartnerId(updated);
        state.partners = state.partners.map((partner) =>
          getPartnerId(partner) === updatedId ? { ...partner, ...updated } : partner
        );
        if (getPartnerId(state.selectedPartner) === updatedId) {
          state.selectedPartner = { ...state.selectedPartner, ...updated };
        }
      })
      .addCase(resetPartnerPassword.fulfilled, (state, action) => {
        const updated = action.payload;
        const updatedId = getPartnerId(updated);
        state.partners = state.partners.map((partner) =>
          getPartnerId(partner) === updatedId ? { ...partner, ...updated } : partner
        );
        if (getPartnerId(state.selectedPartner) === updatedId) {
          state.selectedPartner = { ...state.selectedPartner, ...updated };
        }
      })
      .addCase(deletePartner.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.partners = state.partners.filter(
          (partner) => getPartnerId(partner) !== deletedId
        );
        if (getPartnerId(state.selectedPartner) === deletedId) {
          state.selectedPartner = null;
        }
      })
      // --- shared loading / error handling for every partners thunk ---
      .addMatcher(
        (action) => action.type.startsWith("partners/") && action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("partners/") && action.type.endsWith("/fulfilled"),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("partners/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.error = action.payload;
        }
      );
  },
});

/* ============================================================
 * Actions & selectors
 * ============================================================ */
export const { clearSelectedPartner, clearPartnersError } = partnersSlice.actions;

export const selectAllPartners = (state) => state.partners.partners;
export const selectSelectedPartner = (state) => state.partners.selectedPartner;
export const selectPartnerLeads = (state) => state.partners.partnerLeads;
export const selectPartnersLoading = (state) => state.partners.isLoading;
export const selectPartnersError = (state) => state.partners.error;

export default partnersSlice.reducer;
