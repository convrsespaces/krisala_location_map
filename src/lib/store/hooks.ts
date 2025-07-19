import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";
import { useMemo } from "react";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Hook to select map state
 */
export const useMapState = () => {
  const selectedMapId = useAppSelector(state => state.map.selectedMapId);
  const maps = useAppSelector(state => state.map.maps);
  
  const currentMap = useMemo(() => {
    return maps[selectedMapId] || null;
  }, [maps, selectedMapId]);
  
  const selectedMarker = useMemo(() => {
    if (!currentMap || !currentMap.selectedMarkerId) return null;
    return currentMap.markers.find(marker => marker.id === currentMap.selectedMarkerId) || null;
  }, [currentMap]);
  
  return {
    selectedMapId,
    currentMap,
    maps,
    selectedMarker,
  };
};

/**
 * Hook to select filter state
 */
export const useFilterState = () => {
  const filterState = useAppSelector(state => state.filter);
  
  return {
    ...filterState,
    hasActiveFilters: filterState.activeMapFilterIds.length > 0,
  };
};