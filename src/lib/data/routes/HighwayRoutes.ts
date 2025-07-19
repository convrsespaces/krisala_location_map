// src/lib/data/routes/HighwayRoutes.ts
import { highways as hydHighways } from "./HighwayRoutes-hyd";
import { highways as km10Highways } from "./HighwayRoutes-10km";
import { highways as km5Highways } from "./HighwayRoutes-5km";

export function getHighwaysForMap(mapId: string) {
  switch (mapId) {
    case "hyd":
      return hydHighways;
    case "10km":
      return km10Highways;
    case "5km":
      return km5Highways;
    default:
      return [];  
  }
}

export interface Highway {
  id: string;
  path: string;
  duration: number;
  startDelay: number;
}