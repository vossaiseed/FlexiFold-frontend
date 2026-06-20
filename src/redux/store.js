import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import leadsReducer from "./features/leads/leadsSlice";
import partnersReducer from "./features/partners/partnersSlice";
import leadManagersReducer from "./features/leadManagers/leadManagersSlice";
import salesTeamReducer from "./features/salesTeam/salesTeamSlice";
import conversionsReducer from "./features/conversions/conversionsSlice";
import siteVisitsReducer from "./features/siteVisits/siteVisitsSlice";
import measurementsReducer from "./features/measurements/measurementsSlice";
import modelsReducer from "./features/models/modelsSlice";
import projectsReducer from "./features/projects/projectsSlice";
import projectManagersReducer from "./features/projectManagers/projectManagersSlice";
import telecallersReducer from "./features/telecallers/telecallersSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        leads: leadsReducer,
        partners: partnersReducer,
        leadManagers: leadManagersReducer,
        salesTeam: salesTeamReducer,
        conversions: conversionsReducer,
        siteVisits: siteVisitsReducer,
        measurements: measurementsReducer,
        models: modelsReducer,
        projects: projectsReducer,
        projectManagers: projectManagersReducer,
        telecallers: telecallersReducer,
    },
})
