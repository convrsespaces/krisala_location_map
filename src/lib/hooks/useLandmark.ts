"use client";
import { useEffect, useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setLandmarkId, setActiveRouteId } from "@/lib/store/slices/filterSlice";
import { useOptimizedMapFilter } from "./useOptimizedMapFilter";

interface LandmarkHook {
  selectedLandmarkId: string | null;
  activeRouteId: string | null;
  setLandmarkId: (id: string | null) => void;
  setActiveRoute: (id: string | null) => void;
}

export const useLandmark = (): LandmarkHook => {
  const dispatch = useAppDispatch();
  const selectedLandmarkId = useAppSelector(
    (state) => state.filter.selectedLandmarkId
  );
  const activeRouteId = useAppSelector(
    (state) => state.filter.activeRouteId
  );
  const selectedMapId = useAppSelector((state) => state.map.selectedMapId);
  const { activeMapFilterIds } = useOptimizedMapFilter();

  useEffect(() => {
    if (!activeMapFilterIds.includes("map-filter-landmarks")) {
      dispatch(setLandmarkId(null));
      dispatch(setActiveRouteId(null));
    }
  }, [activeMapFilterIds, dispatch]);

  useEffect(() => {
    dispatch(setLandmarkId(null));
    dispatch(setActiveRouteId(null));
  }, [selectedMapId, dispatch]);

  const setLandmarkIdHandler = useCallback(
    (id: string | null) => {
      dispatch(setLandmarkId(id));
    },
    [dispatch]
  );

  const setActiveRouteHandler = useCallback(
    (id: string | null) => {
      dispatch(setActiveRouteId(id));
    },
    [dispatch]
  );

  return useMemo(
    () => ({
      selectedLandmarkId,
      activeRouteId,
      setLandmarkId: setLandmarkIdHandler,
      setActiveRoute: setActiveRouteHandler,
    }),
    [selectedLandmarkId, activeRouteId, setLandmarkIdHandler, setActiveRouteHandler]
  );
};