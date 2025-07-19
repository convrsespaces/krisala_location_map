"use client";

import { configureStore, combineReducers } from "@reduxjs/toolkit";
import mapReducer from "./slices/mapSlice";
import filterReducer from "./slices/filterSlice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { MapState } from "../types/redux";
import type { FilterState } from "./slices/filterSlice";

const rootReducer = combineReducers({
  filter: filterReducer,
  map: mapReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [
          'filter.filterConfigs.markers.icon',
          'filter.filterConfigs.markers.routeDetails.icon',
          // Any other non-serializable paths
        ],
      },
      thunk: {
        extraArgument: undefined,
      },
      immutableCheck: process.env.NODE_ENV !== "production",
    }),
  preloadedState: undefined,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const selectFilter = (state: RootState) => state.filter;
export const selectMap = (state: RootState) => state.map;
export const selectSelectedMapId = (state: RootState) => state.map.selectedMapId;
export const selectActiveMapFilterIds = (state: RootState) => state.filter.activeMapFilterIds;
export const selectFilterConfigs = (state: RootState) => state.filter.filterConfigs;

if (
  process.env.NODE_ENV !== "production" &&
  typeof module !== "undefined" &&
  // @ts-ignore - module.hot exists in webpack environment
  module.hot
) {
  // @ts-ignore - module.hot exists in webpack environment
  module.hot.accept("./slices/mapSlice", () => {
    const { default: newMapReducer } = require("./slices/mapSlice");
    store.replaceReducer(combineReducers({
      filter: filterReducer as typeof filterReducer,
      map: newMapReducer as typeof mapReducer,
    }));
  });
  // @ts-ignore - module.hot exists in webpack environment
  module.hot.accept("./slices/filterSlice", () => {
    const { default: newFilterReducer } = require("./slices/filterSlice");
    store.replaceReducer(combineReducers({
      filter: newFilterReducer as typeof filterReducer,
      map: mapReducer as typeof mapReducer,
    }));
  });
}
