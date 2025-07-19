import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { loadMarkerData } from "@/lib/utils/dataLoader";

export type SVGElementType = "path" | "circle" | "rect";

export interface SVGPathAttributes {
  d: string;
  stroke?: string;
  fill?: string;
  strokeWidth?: string;
  strokeOpacity?: string;
  strokeLinecap?: "round" | "butt" | "square" | "inherit";
}

export interface SVGCircleAttributes {
  cx: number;
  cy: number;
  r: string | number;
  fill?: string;
}

export interface SVGRectAttributes {
  x: string | number;
  y: string | number;
  width: string | number;
  height: string | number;
  fill?: string;
}

export type SVGAttributes =
  | { type: "path"; attributes: SVGPathAttributes }
  | { type: "circle"; attributes: SVGCircleAttributes }
  | { type: "rect"; attributes: SVGRectAttributes };

export interface Marker {
  id: string;
  marker: SVGAttributes;
  route?: SVGAttributes;
  routeDetails?: {
    icon: SVGAttributes;
    landmark_name?: string;
    details?: string;
    distance?: string;
    time?: string;
    img?: string;
  };
  price?: number;
  size?: number;
}

export interface FilterConfig {
  id: string;
  title: string;
  className: string;
  iconKey: string;
  markers: Marker[];
}

export interface FilterState {
  flatFilterPriceValues: number[];
  flatFilterSizeValues: number[];
  activeMapFilterIds: string[];
  selectedLandmarkId: string | null;
  activeRouteId: string | null;
  filterConfigs: FilterConfig[];
  loading: boolean;
  error: string | null;
  lastLoadedMapId: string | null;
}
export const createCircleMarker = (
  location: { id: string; cx: number; cy: number; fill?: string },
  fill: string,
  namePrefix: string
): Marker => ({
  id: location.id,
  marker: {
    type: "circle",
    attributes: {
      cx: location.cx,
      cy: location.cy,
      r: 22.5,
      fill: location.fill || fill,
    },
  },
  routeDetails: {
    landmark_name:
      location.id.split(`__${namePrefix} `)[1]?.split(" _d_")[0] || location.id,
    icon: {
      type: "circle",
      attributes: {
        cx: 0,
        cy: 0,
        r: 10,
        fill,
      },
    },
  },
});

const initialState: FilterState = {
  flatFilterPriceValues: [0, Infinity],
  flatFilterSizeValues: [0, Infinity],
  activeMapFilterIds: [],
  selectedLandmarkId: null,
  activeRouteId: null,
  filterConfigs: [],
  loading: false,
  error: null,
  lastLoadedMapId: null,
};

export const loadFilterData = createAsyncThunk(
  "filter/loadFilterData",
  async (mapId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { filter: FilterState };
      if (
        state.filter.lastLoadedMapId === mapId &&
        state.filter.filterConfigs.length > 0
      ) {
        return {
          filterConfigs: state.filter.filterConfigs,
          activeFilterIds: state.filter.activeMapFilterIds,
        };
      }

      const result = await loadMarkerData(mapId);
      const transformedConfigs: FilterConfig[] = result.filterConfigs.map(
        (config) => ({
          ...config,
          markers: config.markers.map((marker) => {
            const transformedMarker: Marker = {
              id: marker.id,
              marker: {
                type: marker.marker.type,
                attributes: { ...marker.marker.attributes },
              },
              route: marker.route
                ? {
                    type: marker.route.type,
                    attributes: { ...marker.route.attributes },
                  }
                : undefined,
              routeDetails: marker.routeDetails
                ? {
                    landmark_name: marker.routeDetails.landmark_name,
                    details: marker.routeDetails.details,
                    distance: marker.routeDetails.distance,
                    time: marker.routeDetails.time,
                    img: marker.routeDetails.img,
                    icon: {
                      type: marker.routeDetails.icon.type,
                      attributes: { ...marker.routeDetails.icon.attributes },
                    },
                  }
                : undefined,
            };
            return transformedMarker;
          }),
        })
      );

      return {
        filterConfigs: transformedConfigs,
        activeFilterIds: result.activeFilterIds,
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to load filter data"
      );
    }
  }
);

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setPriceFilter(state, action: PayloadAction<number[]>) {
      state.flatFilterPriceValues = action.payload;
    },

    setSizeFilter(state, action: PayloadAction<number[]>) {
      state.flatFilterSizeValues = action.payload;
    },

    setMapFilterIds(state, action: PayloadAction<string[]>) {
      if (
        JSON.stringify(state.activeMapFilterIds) !==
        JSON.stringify(action.payload)
      ) {
        state.activeMapFilterIds = action.payload;
        if (action.payload.length === 0) {
          localStorage.setItem("filtersHidden", "true");
        } else {
          localStorage.removeItem("filtersHidden");
        }
      }
    },

    toggleMapFilter(state, action: PayloadAction<string>) {
      const filterId = action.payload;
      const index = state.activeMapFilterIds.indexOf(filterId);

      if (index === -1) {
        state.activeMapFilterIds.push(filterId);
        localStorage.removeItem("filtersHidden");
      } else {
        state.activeMapFilterIds.splice(index, 1);
        if (state.activeMapFilterIds.length === 0) {
          localStorage.setItem("filtersHidden", "true");
        }
      }
    },

    resetMapFilters(state) {
      state.activeMapFilterIds = state.filterConfigs.map((config) => config.id);
      localStorage.removeItem("filtersHidden");
    },

    setLandmarkId(state, action: PayloadAction<string | null>) {
      state.selectedLandmarkId = action.payload;
      // When a landmark is selected, also set it as the active route
      state.activeRouteId = action.payload;
    },

    setActiveRouteId(state, action: PayloadAction<string | null>) {
      state.activeRouteId = action.payload;
    },

    setFilterConfigs(state, action: PayloadAction<FilterConfig[]>) {
      state.filterConfigs = action.payload;
    },

    addFilterConfig(state, action: PayloadAction<FilterConfig>) {
      const exists = state.filterConfigs.some(
        (config) => config.id === action.payload.id
      );
      if (!exists) {
        state.filterConfigs.push(action.payload);
        if (!state.activeMapFilterIds.includes(action.payload.id)) {
          state.activeMapFilterIds.push(action.payload.id);
        }
      }
    },

    removeFilterConfig(state, action: PayloadAction<string>) {
      state.filterConfigs = state.filterConfigs.filter(
        (config) => config.id !== action.payload
      );

      const index = state.activeMapFilterIds.indexOf(action.payload);
      if (index !== -1) {
        state.activeMapFilterIds.splice(index, 1);
      }
    },

    updateFilterMarkers(
      state,
      action: PayloadAction<{ id: string; markers: Marker[] }>
    ) {
      const config = state.filterConfigs.find(
        (c) => c.id === action.payload.id
      );
      if (config) {
        config.markers = action.payload.markers;
      }
    },

    clearFilters(state) {
      state.activeMapFilterIds = [];
      state.selectedLandmarkId = null;
      state.activeRouteId = null;
      state.flatFilterPriceValues = [0, Infinity];
      state.flatFilterSizeValues = [0, Infinity];
      localStorage.setItem("filtersHidden", "true");
    },

    resetFilterState(state) {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadFilterData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadFilterData.fulfilled, (state, action) => {
        state.loading = false;
        state.filterConfigs = action.payload.filterConfigs;
        state.activeMapFilterIds = action.payload.activeFilterIds;
        state.lastLoadedMapId = action.meta.arg;
        state.error = null;
      })
      .addCase(loadFilterData.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Failed to load filter data";
      });
  },
});

export const {
  setPriceFilter,
  setSizeFilter,
  setMapFilterIds,
  toggleMapFilter,
  resetMapFilters,
  setLandmarkId,
  setActiveRouteId,
  setFilterConfigs,
  addFilterConfig,
  removeFilterConfig,
  updateFilterMarkers,
  clearFilters,
  resetFilterState,
} = filterSlice.actions;

export default filterSlice.reducer;
