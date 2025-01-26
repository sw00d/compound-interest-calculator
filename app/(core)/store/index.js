import { configureStore } from "@reduxjs/toolkit";
import tabsReducer from "./tabs/tabsSlice";

export const store = configureStore({
  reducer: {
    tabs: tabsReducer,
  },
});
