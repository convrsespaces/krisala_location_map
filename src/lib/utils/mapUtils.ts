import { mapsConfig } from "@/config/maps";
import { MapData } from "../types/redux";
import { TransformedMarker } from "../types";
import { landmarks_10km } from "@/lib/data/routes/LandmarkRoute10km";

/**
 * Initializes map data for all maps in the configuration
 */
export const initializeMapData = (): Record<string, MapData> => {
  const initialMaps: Record<string, MapData> = {};

  mapsConfig.forEach((map) => {
    initialMaps[map.id] = {
      id: map.id,
      markers: [],
      selectedMarkerId: null,
      projectSite: null, // We're using fixed coordinates in the code instead
    };
  });

  return initialMaps;
};

/**
 * Converts landmarks from a map configuration to transformed markers
 */
export const landmarksToMarkers = (mapId: string): TransformedMarker[] => {
  const map = mapsConfig.find((m) => m.id === mapId);
  if (!map) return [];

  return map.landmarks.map((landmark) => ({
    id: landmark.id,
    name: landmark.name,
    type: "landmark",
    position: {
      x: landmark.x,
      y: landmark.y,
    },
    iconKey: landmark.icon,
    description: landmark.description || "",
  }));
};

/**
 * Gets the appropriate map configuration based on the map ID
 */
export const getMapConfig = (mapId: string) => {
  return mapsConfig.find((map) => map.id === mapId) || mapsConfig[0];
};

export const getMapData = (mapId: string) => {
  try {
    // Clear require cache to ensure fresh data is loaded
    Object.keys(require.cache).forEach((key) => {
      if (key.includes("LandmarkRoute") || key.includes("LandmarkIcons")) {
        delete require.cache[key];
      }
    });

    switch (mapId) {
      case "hyd":
        try {
          return {
            landmarks:
              require("../data/routes/LandmarkRouteHyd").landmarks_hyd || [],
            routes:
              require("../data/routes/LandmarkRouteHyd").LandmarkLandmark || {},
            markers:
              require("../data/icons/LandmarkIconsHyd").landmarkIconsHyd || [],
          };
        } catch (error) {
          return { landmarks: [], routes: {}, markers: [] };
        }
      case "5km":
        return {
          landmarks:
            require("../data/routes/LandmarkRoute5km").landmarks_5km || [],
          routes:
            require("../data/routes/LandmarkRoute5km").LandmarkLandmark || {},
          markers:
            require("../data/icons/LandmarkIcons5km").landmarkIcons5km || [],
        };
      case "10km":
        return {
          landmarks:
            require("../data/routes/LandmarkRoute10km").landmarks_10km || [],
          routes:
            require("../data/routes/LandmarkRoute10km").LandmarkLandmark || {},
          markers:
            require("../data/icons/LandmarkIcons10km").landmarkIcons10km || [],
        };
      default:
        return {
          landmarks: [],
          routes: {},
          markers: [],
        };
    }
  } catch (error) {
    return {
      landmarks: [],
      routes: {},
      markers: [],
    };
  }
};

export const getMapImage = (mapId: string): string => {
  switch (mapId) {
    case "5km":
      return "/maps/10km.png";
    case "10km":
      return "/maps/35km.png";
    default:
      return "/maps/35km.png";
  }
};
