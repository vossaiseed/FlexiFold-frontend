import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { getApiError } from "../../services/api";

// All lead endpoints live under /leads
const LEADS_URL = "/leads";

/* ============================================================
 * Async thunks — each one talks to the API for a single action.
 * The shared `api` client adds the auth token automatically.
 * ============================================================ */

// GET /leads — load every lead
export const fetchLeads = createAsyncThunk(
  "leads/fetchLeads",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get(LEADS_URL);
      return data.data ?? data; // supports { data: [...] } or a raw array
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// GET /leads/:id — load a single lead
export const fetchLeadById = createAsyncThunk(
  "leads/fetchLeadById",
  async (leadId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`${LEADS_URL}/${leadId}`);
      return data.data ?? data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// POST /leads — create a new lead
export const createLead = createAsyncThunk(
  "leads/createLead",
  async (newLead, { rejectWithValue }) => {
    try {
      const { data } = await api.post(LEADS_URL, newLead);
      return data.data ?? data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// PUT /leads/:id — update an existing lead
export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async ({ leadId, changes }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`${LEADS_URL}/${leadId}`, changes);
      return data.data ?? data;
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

// DELETE /leads/:id — remove a lead
export const deleteLead = createAsyncThunk(
  "leads/deleteLead",
  async (leadId, { rejectWithValue }) => {
    try {
      await api.delete(`${LEADS_URL}/${leadId}`);
      return leadId; // return the id so we can drop it from state
    } catch (error) {
      return rejectWithValue(getApiError(error));
    }
  }
);

/* ============================================================
 * Slice
 * ============================================================ */

const initialState = {
  leads: [], // the full list of leads
  selectedLead: null, // the lead currently being viewed / edited
  isLoading: false, // true while any leads request is in flight
  error: null, // last error message, or null
};

const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    // Clear the selected lead (e.g. when closing a details view).
    clearSelectedLead: (state) => {
      state.selectedLead = null;
    },
    // Dismiss the current error message.
    clearLeadsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- success handlers: update the data ---
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.leads = action.payload;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.selectedLead = action.payload;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        state.leads.unshift(action.payload);
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        const updated = action.payload;
        state.leads = state.leads.map((lead) =>
          lead._id === updated._id ? updated : lead
        );
        if (state.selectedLead?._id === updated._id) {
          state.selectedLead = updated;
        }
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.leads = state.leads.filter((lead) => lead._id !== deletedId);
        if (state.selectedLead?._id === deletedId) {
          state.selectedLead = null;
        }
      })
      // --- shared loading / error handling for every leads thunk ---
      .addMatcher(
        (action) => action.type.startsWith("leads/") && action.type.endsWith("/pending"),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("leads/") && action.type.endsWith("/fulfilled"),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith("leads/") && action.type.endsWith("/rejected"),
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
export const { clearSelectedLead, clearLeadsError } = leadsSlice.actions;

export const selectAllLeads = (state) => state.leads.leads;
export const selectSelectedLead = (state) => state.leads.selectedLead;
export const selectLeadsLoading = (state) => state.leads.isLoading;
export const selectLeadsError = (state) => state.leads.error;

export default leadsSlice.reducer;
