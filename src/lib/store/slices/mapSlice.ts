import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { MapState, MapData } from "../../types/redux";
import { TransformedMarker } from "../../types";
import { initializeMapData } from "../../utils/mapUtils";

const initialState: MapState = {
  maps: initializeMapData(),
  selectedMapId: "10km",
  loading: false,
  error: null,
};

// Async thunk to load map data
export const loadMapData = createAsyncThunk(
  'map/loadMapData',
  async (mapId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as { map: MapState };
      if (state.map.maps[mapId]?.markers.length > 0) {
        return state.map.maps[mapId];
      }

      // Initialize map data if it doesn't exist
      const mapData = initializeMapData()[mapId];
      if (!mapData) {
        throw new Error(`Map with ID ${mapId} not found`);
      }

      return mapData;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load map data');
    }
  }
);

const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setMarkers: (
      state,
      action: PayloadAction<{ mapId: string; markers: TransformedMarker[] }>
    ) => {
      const { mapId, markers } = action.payload;
      if (state.maps[mapId]) {
        state.maps[mapId].markers = markers;
      } else {
        // Create the map if it doesn't exist
        state.maps[mapId] = {
          id: mapId,
          markers: markers,
          selectedMarkerId: null,
          projectSite: null,
        };
      }
    },
    
    addMarker: (
      state,
      action: PayloadAction<{ mapId: string; marker: TransformedMarker }>
    ) => {
      const { mapId, marker } = action.payload;
      if (!state.maps[mapId]) {
        // Create the map if it doesn't exist
        state.maps[mapId] = {
          id: mapId,
          markers: [],
          selectedMarkerId: null,
          projectSite: null,
        };
      }
      
      // Check if marker with same ID already exists
      const existingIndex = state.maps[mapId].markers.findIndex(
        (m) => m.id === marker.id
      );
      
      if (existingIndex === -1) {
        // Add only if it doesn't exist
        state.maps[mapId].markers.push(marker);
      } else {
        // Update if it exists
        state.maps[mapId].markers[existingIndex] = marker;
      }
    },
    
    updateMarker: (
      state,
      action: PayloadAction<{ mapId: string; marker: TransformedMarker }>
    ) => {
      const { mapId, marker } = action.payload;
      if (state.maps[mapId]) {
        const index = state.maps[mapId].markers.findIndex(
          (m) => m.id === marker.id
        );
        if (index !== -1) {
          state.maps[mapId].markers[index] = marker;
        } else {
          // Add the marker if it doesn't exist
          state.maps[mapId].markers.push(marker);
        }
      }
    },
    
    removeMarker: (
      state,
      action: PayloadAction<{ mapId: string; markerId: string }>
    ) => {
      const { mapId, markerId } = action.payload;
      if (state.maps[mapId]) {
        state.maps[mapId].markers = state.maps[mapId].markers.filter(
          (marker) => marker.id !== markerId
        );
        
        // If the removed marker was selected, clear the selection
        if (state.maps[mapId].selectedMarkerId === markerId) {
          state.maps[mapId].selectedMarkerId = null;
        }
      }
    },
    
    setSelectedMarkerId: (
      state,
      action: PayloadAction<{ mapId: string; markerId: string | null }>
    ) => {
      const { mapId, markerId } = action.payload;
      if (state.maps[mapId]) {
        state.maps[mapId].selectedMarkerId = markerId;
      } else if (markerId) {
        // Create the map if it doesn't exist but we're trying to select a marker
        state.maps[mapId] = {
          id: mapId,
          markers: [],
          selectedMarkerId: markerId,
          projectSite: null,
        };
      }
    },
    
    setSelectedMapId: (state, action: PayloadAction<string>) => {
      const mapId = action.payload;
      state.selectedMapId = mapId;
      
      // Ensure the map exists
      if (!state.maps[mapId]) {
        state.maps[mapId] = {
          id: mapId,
          markers: [],
          selectedMarkerId: null,
          projectSite: null,
        };
      }
    },
    
    addMap: (state, action: PayloadAction<MapData>) => {
      const mapData = action.payload;
      state.maps[mapData.id] = mapData;
    },
    
    clearMap: (state, action: PayloadAction<string>) => {
      const mapId = action.payload;
      if (state.maps[mapId]) {
        state.maps[mapId].markers = [];
        state.maps[mapId].selectedMarkerId = null;
      }
    },
    
    resetMaps: (state) => {
      state.maps = initializeMapData();
      // Keep the selected map ID
    },

    resetMapState: (state) => {
      return { ...initialState };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadMapData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMapData.fulfilled, (state, action) => {
        state.loading = false;
        state.maps[action.payload.id] = action.payload;
        state.error = null;
      })
      .addCase(loadMapData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to load map data';
      });
  },
});

export const {
  setMarkers,
  addMarker,
  updateMarker,
  removeMarker,
  setSelectedMarkerId,
  setSelectedMapId,
  addMap,
  clearMap,
  resetMaps,
  resetMapState,
} = mapSlice.actions;

export default mapSlice.reducer;
