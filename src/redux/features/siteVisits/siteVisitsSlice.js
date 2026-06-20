import { createCrudSlice } from "../pipeline/createCrudSlice";

const s = createCrudSlice("siteVisits", "/site-visits");

export const {
  fetchAll: fetchSiteVisits,
  createItem: createSiteVisit,
  updateItem: updateSiteVisit,
  deleteItem: deleteSiteVisit,
} = s.thunks;

export const { clearError: clearSiteVisitsError } = s.actions;

export const selectSiteVisits = (state) => state.siteVisits.items;
export const selectSiteVisitsLoading = (state) => state.siteVisits.loading;

export default s.reducer;
