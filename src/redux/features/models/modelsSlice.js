import { createCrudSlice } from "../pipeline/createCrudSlice";

const s = createCrudSlice("models", "/models");

export const {
  fetchAll: fetchModels,
  createItem: createModel,
  updateItem: updateModel,
  deleteItem: deleteModel,
} = s.thunks;

export const { clearError: clearModelsError } = s.actions;

export const selectModels = (state) => state.models.items;
export const selectModelsLoading = (state) => state.models.loading;

export default s.reducer;
