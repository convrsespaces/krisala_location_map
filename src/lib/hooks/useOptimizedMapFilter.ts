import { useCallback, useMemo, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  setMapFilterIds,
  toggleMapFilter,
  resetMapFilters,
  loadFilterData,
} from "@/lib/store/slices/filterSlice";
import { selectFilter } from "@/lib/store";

/**
 * Custom hook for optimized map filter operations
 * Provides memoized selectors and handlers for better performance
 */
export const useOptimizedMapFilter = () => {
  const dispatch = useAppDispatch();

  const activeMapFilterIds = useAppSelector(
    (state) => state.filter.activeMapFilterIds
  );
  const filterConfigs = useAppSelector((state) => state.filter.filterConfigs);
  const selectedMapId = useAppSelector((state) => state.map.selectedMapId);
  const loading = useAppSelector((state) => state.filter.loading);
  const error = useAppSelector((state) => state.filter.error);

  useEffect(() => {
    if (filterConfigs.length === 0 && !loading && !error) {
      dispatch(loadFilterData(selectedMapId));
    }
  }, [
    activeMapFilterIds,
    filterConfigs.length,
    selectedMapId,
    loading,
    error,
    dispatch,
  ]);

  const allFilterIds = useMemo(
    () => filterConfigs.map((config: { id: string }) => config.id),
    [filterConfigs]
  );

  const allActive = useMemo(
    () =>
      allFilterIds.length > 0 &&
      allFilterIds.length === activeMapFilterIds.length &&
      allFilterIds.every((id: string) => activeMapFilterIds.includes(id)),
    [allFilterIds, activeMapFilterIds]
  );

  const noneActive = useMemo(
    () => activeMapFilterIds.length === 0,
    [activeMapFilterIds]
  );

  const isFilterActive = useCallback(
    (filterId: string) => activeMapFilterIds.includes(filterId),
    [activeMapFilterIds]
  );

  const setFilterIds = useCallback(
    (filterIds: string[]) => {
      if (JSON.stringify(activeMapFilterIds) !== JSON.stringify(filterIds)) {
        dispatch(setMapFilterIds(filterIds));
      }
    },
    [dispatch, activeMapFilterIds]
  );

  const toggleFilter = useCallback(
    (filterId: string) => {
      dispatch(toggleMapFilter(filterId));
    },
    [dispatch]
  );

  // const showAllFilters = useCallback(() => {
  //   if (!allActive && allFilterIds.length > 0) {
  //     dispatch(setMapFilterIds(allFilterIds));
  //     localStorage.removeItem("filtersHidden");
  //   }
  // }, [dispatch, allFilterIds, allActive]);

  // const hideAllFilters = useCallback(() => {
  //   if (!noneActive) {
  //     dispatch(setMapFilterIds([]));
  //     localStorage.setItem("filtersHidden", "true");
  //   }
  // }, [dispatch, noneActive]);

  const toggleFilters = useCallback(() => {
  if (!allActive && allFilterIds.length > 0) {
    // Show all filters
    dispatch(setMapFilterIds(allFilterIds));
    localStorage.removeItem("filtersHidden");
  } else if (!noneActive) {
    // Hide all filters
    dispatch(setMapFilterIds([]));
    localStorage.setItem("filtersHidden", "true");
  }
}, [dispatch, allFilterIds, allActive, noneActive]);

  const resetFilters = useCallback(() => {
    dispatch(resetMapFilters());
  }, [dispatch]);

  useEffect(() => {
    if (
      activeMapFilterIds.length === 0 &&
      allFilterIds.length > 0 &&
      !loading
    ) {
      const shouldAutoActivate = !localStorage.getItem("filtersHidden");
      if (shouldAutoActivate) {
        dispatch(setMapFilterIds(allFilterIds));
      }
    }
  }, [activeMapFilterIds.length, allFilterIds, loading, dispatch]);

  useEffect(() => {
    dispatch(loadFilterData(selectedMapId));
  }, [selectedMapId, dispatch]);

  return {
    activeMapFilterIds,
    filterConfigs,
    allFilterIds,
    allActive,
    noneActive,
    isFilterActive,
    setFilterIds,
    toggleFilter,
    // showAllFilters,
    // hideAllFilters,
    toggleFilters,
    resetFilters,
    loading,
    error,
  };
};
