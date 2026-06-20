import { createCrudSlice } from "../pipeline/createCrudSlice";

const s = createCrudSlice("telecallers", "/telecallers");

export const {
  fetchAll: fetchTelecallers,
  createItem: createTelecaller,
  updateItem: updateTelecaller,
  deleteItem: deleteTelecaller,
} = s.thunks;

export const { clearError: clearTelecallersError } = s.actions;

export const selectTelecallers = (state) => state.telecallers.items;
export const selectTelecallersLoading = (state) => state.telecallers.loading;

export default s.reducer;
