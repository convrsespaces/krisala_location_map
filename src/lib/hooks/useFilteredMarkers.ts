"use client";

import { useMemo } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { useMapState } from '@/lib/store/hooks';
import { svgDataToComponent } from '@/lib/utils/svgUtils';

/**
 * Custom hook to get filtered markers based on active filters
 */
export const useFilteredMarkers = () => {
  const { currentMap } = useMapState();
  const activeMapFilterIds = useAppSelector(state => state.filter.activeMapFilterIds);
  const filterConfigs = useAppSelector(state => state.filter.filterConfigs);
  const selectedLandmarkId = useAppSelector(state => state.filter.selectedLandmarkId);
  const flatFilterPriceValues = useAppSelector(state => state.filter.flatFilterPriceValues);
  const flatFilterSizeValues = useAppSelector(state => state.filter.flatFilterSizeValues);

  const filteredMarkers = useMemo(() => {
    if (!currentMap) return [];

    // Get all markers from active filter configs
    const activeFilterConfigs = filterConfigs.filter(config => 
      activeMapFilterIds.includes(config.id)
    );

    // Get all markers from active filters
    const markers = activeFilterConfigs.flatMap(config => config.markers);

    // Filter by landmark if selected
    if (selectedLandmarkId) {
      return markers.filter(marker => marker.id === selectedLandmarkId);
    }

    // Filter by price and size if set
    return markers.filter(marker => {
      const price = marker.price || 0;
      const size = marker.size || 0;

      const isInPriceRange = price >= flatFilterPriceValues[0] && 
                           price <= flatFilterPriceValues[1];
      const isInSizeRange = size >= flatFilterSizeValues[0] && 
                          size <= flatFilterSizeValues[1];

      return isInPriceRange && isInSizeRange;
    });
  }, [
    currentMap,
    activeMapFilterIds,
    filterConfigs,
    selectedLandmarkId,
    flatFilterPriceValues,
    flatFilterSizeValues
  ]);

  // Transform markers to include React elements only at render time
  const transformedMarkers = useMemo(() => {
    return filteredMarkers.map(marker => ({
      ...marker,
      marker: marker.marker ? svgDataToComponent(marker.marker) : null,
      route: marker.route ? svgDataToComponent(marker.route) : undefined,
      routeDetails: marker.routeDetails ? {
        ...marker.routeDetails,
        icon: marker.routeDetails.icon ? svgDataToComponent(marker.routeDetails.icon) : null
      } : undefined
    }));
  }, [filteredMarkers]);

  const selectedMarker = useMemo(() => {
    if (!currentMap?.selectedMarkerId) return null;
    return transformedMarkers.find(marker => marker.id === currentMap.selectedMarkerId) || null;
  }, [currentMap?.selectedMarkerId, transformedMarkers]);

  return {
    filteredMarkers: transformedMarkers,
    selectedMarker,
    hasActiveFilters: activeMapFilterIds.length > 0,
    hasSelectedLandmark: selectedLandmarkId !== null,
  };
};