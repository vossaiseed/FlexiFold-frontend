import { createCrudSlice } from "../pipeline/createCrudSlice";

const s = createCrudSlice("projects", "/projects");

export const {
  fetchAll: fetchProjects,
  createItem: createProject,
  updateItem: updateProject,
  deleteItem: deleteProject,
} = s.thunks;

export const { clearError: clearProjectsError } = s.actions;

export const selectProjects = (state) => state.projects.items;
export const selectProjectsLoading = (state) => state.projects.loading;

export default s.reducer;
