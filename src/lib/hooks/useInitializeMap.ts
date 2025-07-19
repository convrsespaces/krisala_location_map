"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { loadMapData } from "@/lib/store/slices/mapSlice";
import { loadFilterData } from "@/lib/store/slices/filterSlice";
import { mapsConfig } from "@/config/maps";

/**
 * Hook to initialize map data when the app loads
 */
export const useInitializeMap = () => {
  const dispatch = useAppDispatch();
  const selectedMapId = useAppSelector((state) => state.map.selectedMapId);
  const mapLoading = useAppSelector((state) => state.map.loading);
  const mapError = useAppSelector((state) => state.map.error);
  const filterLoading = useAppSelector((state) => state.filter.loading);
  const filterError = useAppSelector((state) => state.filter.error);
  const filterConfigs = useAppSelector((state) => state.filter.filterConfigs);

  useEffect(() => {
    if (filterConfigs.length > 0) {
      return;
    }

    const validMapId = selectedMapId || mapsConfig[0].id;
    dispatch(loadMapData(validMapId))
      .unwrap()
      .then(() => {
        dispatch(loadFilterData(validMapId));
      })
      .catch();
  }, [dispatch, selectedMapId, filterConfigs.length]);

  return {
    isLoading: mapLoading || filterLoading,
    error: mapError || filterError,
    selectedMapId,
    hasFilterData: filterConfigs.length > 0,
  };
};
