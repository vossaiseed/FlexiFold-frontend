import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { getApiError } from "../../services/api";

// Factory for the uniform CRUD slices used by the fulfilment pipeline
// (site visits, measurements, models, projects, project managers).
// Mirrors the shape of the hand-written slices: { items, loading, error }.
export function createCrudSlice(name, url) {
  const getId = (x) => x?.id ?? x?._id;

  const fetchAll = createAsyncThunk(`${name}/fetchAll`, async (params, { rejectWithValue }) => {
    try {
      const { data } = await api.get(url, { params: params || {} });
      return data.data ?? data;
    } catch (e) {
      return rejectWithValue(getApiError(e));
    }
  });

  const createItem = createAsyncThunk(`${name}/create`, async (body, { rejectWithValue }) => {
    try {
      const { data } = await api.post(url, body);
      return data.data ?? data;
    } catch (e) {
      return rejectWithValue(getApiError(e));
    }
  });

  const updateItem = createAsyncThunk(`${name}/update`, async ({ id, changes }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`${url}/${id}`, changes);
      return data.data ?? data;
    } catch (e) {
      return rejectWithValue(getApiError(e));
    }
  });

  const deleteItem = createAsyncThunk(`${name}/delete`, async (id, { rejectWithValue }) => {
    try {
      await api.delete(`${url}/${id}`);
      return id;
    } catch (e) {
      return rejectWithValue(getApiError(e));
    }
  });

  const slice = createSlice({
    name,
    initialState: { items: [], loading: false, error: null },
    reducers: {
      clearError: (s) => { s.error = null; },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchAll.fulfilled, (s, a) => { s.items = a.payload || []; })
        .addCase(createItem.fulfilled, (s, a) => {
          // Upsert by id: the "create" endpoint may return an existing row
          // (e.g. re-assigning a PM updates the lead's project), so avoid dupes.
          if (!a.payload) return;
          const id = getId(a.payload);
          const i = s.items.findIndex((x) => getId(x) === id);
          if (i >= 0) s.items[i] = { ...s.items[i], ...a.payload };
          else s.items.unshift(a.payload);
        })
        .addCase(updateItem.fulfilled, (s, a) => {
          const id = getId(a.payload);
          s.items = s.items.map((x) => (getId(x) === id ? { ...x, ...a.payload } : x));
        })
        .addCase(deleteItem.fulfilled, (s, a) => {
          s.items = s.items.filter((x) => getId(x) !== a.payload);
        })
        .addMatcher((a) => a.type.startsWith(`${name}/`) && a.type.endsWith("/pending"), (s) => {
          s.loading = true; s.error = null;
        })
        .addMatcher((a) => a.type.startsWith(`${name}/`) && a.type.endsWith("/fulfilled"), (s) => {
          s.loading = false;
        })
        .addMatcher((a) => a.type.startsWith(`${name}/`) && a.type.endsWith("/rejected"), (s, a) => {
          s.loading = false; s.error = a.payload || a.error?.message;
        });
    },
  });

  return { reducer: slice.reducer, actions: slice.actions, thunks: { fetchAll, createItem, updateItem, deleteItem } };
}
