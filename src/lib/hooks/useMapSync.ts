"use client";

import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { setSelectedMapId, loadMapData } from '@/lib/store/slices/mapSlice';
import { loadFilterData, resetFilterState } from '@/lib/store/slices/filterSlice';

/**
 * Custom hook to synchronize map and filter state
 * This ensures that when a map is selected, the appropriate data is loaded
 * and the filter state is properly reset
 */
export const useMapSync = () => {
  const dispatch = useAppDispatch();
  const selectedMapId = useAppSelector(state => state.map.selectedMapId);
  const mapLoading = useAppSelector(state => state.map.loading);
  const mapError = useAppSelector(state => state.map.error);
  const filterLoading = useAppSelector(state => state.filter.loading);
  const filterError = useAppSelector(state => state.filter.error);
  
  // Load map and filter data when the selected map changes
  useEffect(() => {
    if (selectedMapId) {
      // Reset filter state first
      dispatch(resetFilterState());
      
      // Load map data
      dispatch(loadMapData(selectedMapId))
        .unwrap()
        .then(() => {
          // Load filter data after map data is loaded
          dispatch(loadFilterData(selectedMapId));
        })
        .catch();
    }
  }, [selectedMapId, dispatch]);
  
  // Function to change the map and load its data
  const changeMap = useCallback((mapId: string) => {
    dispatch(setSelectedMapId(mapId));
  }, [dispatch]);
  
  return {
    selectedMapId,
    changeMap,
    isLoading: mapLoading || filterLoading,
    error: mapError || filterError,
  };
};