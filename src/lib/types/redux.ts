import { TransformedMarker } from "./index";
import { FilterState } from "../store/slices/filterSlice";

export interface MapData {
  id: string;
  markers: TransformedMarker[];
  selectedMarkerId: string | null;
  projectSite: {
    id: string;
    name: string;
    coordinates: [number, number];
  } | null; // Now optional since we're using fixed coordinates in the code
}

export interface MapState {
  maps: Record<string, MapData>;
  selectedMapId: string;
  loading: boolean;
  error: string | null;
}

export interface RootState {
  map: MapState;
  filter: FilterState;
}
