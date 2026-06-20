import { createCrudSlice } from "../pipeline/createCrudSlice";

const s = createCrudSlice("measurements", "/measurements");

export const {
  fetchAll: fetchMeasurements,
  createItem: createMeasurement,
  updateItem: updateMeasurement,
  deleteItem: deleteMeasurement,
} = s.thunks;

export const { clearError: clearMeasurementsError } = s.actions;

export const selectMeasurements = (state) => state.measurements.items;
export const selectMeasurementsLoading = (state) => state.measurements.loading;

export default s.reducer;
