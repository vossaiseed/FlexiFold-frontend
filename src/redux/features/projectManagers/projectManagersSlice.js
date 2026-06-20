import { createCrudSlice } from "../pipeline/createCrudSlice";

const s = createCrudSlice("projectManagers", "/project-managers");

export const {
  fetchAll: fetchProjectManagers,
  createItem: createProjectManager,
  updateItem: updateProjectManager,
  deleteItem: deleteProjectManager,
} = s.thunks;

export const { clearError: clearProjectManagersError } = s.actions;

export const selectProjectManagers = (state) => state.projectManagers.items;
export const selectProjectManagersLoading = (state) => state.projectManagers.loading;

export default s.reducer;
