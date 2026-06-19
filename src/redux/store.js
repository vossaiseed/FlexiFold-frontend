import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import leadsReducer from "./features/leads/leadsSlice";
import partnersReducer from "./features/partners/partnersSlice";
import leadManagersReducer from "./features/leadManagers/leadManagersSlice";
import salesTeamReducer from "./features/salesTeam/salesTeamSlice";
import conversionsReducer from "./features/conversions/conversionsSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        leads: leadsReducer,
        partners: partnersReducer,
        leadManagers: leadManagersReducer,
        salesTeam: salesTeamReducer,
        conversions: conversionsReducer,
    },
})
