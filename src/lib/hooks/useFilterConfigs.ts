import React from "react";
import { useAppSelector } from "@/lib/store/hooks";
import {
  FilterConfig,
  Marker,
  SVGAttributes,
} from "@/lib/store/slices/filterSlice";
import { svgDataToComponent } from "@/lib/utils/svgUtils";
import { useMemo } from "react";

export interface TransformedMarker {
  id: string;
  icon: React.ReactElement;
  route?: string | SVGAttributes;
  routeDetails?: {
    icon?: SVGAttributes;
    landmark_name?: string;
    details?: string;
    distance?: string;
    time?: string;
    img?: string;
  };
}

export interface TransformedFilterConfig {
  id: string;
  title: string;
  className: string;
  iconKey: string;
  markers: TransformedMarker[];
}

export const useFilterConfigs = () => {
  const filterConfigs = useAppSelector((state) => state.filter.filterConfigs);

  const transformedConfigs = useMemo(() => {
    return filterConfigs.map((config: FilterConfig) => {
      const transformedMarkers = config.markers.map((marker: Marker) => {
        const transformedMarker: TransformedMarker = {
          id: marker.id,
          icon: svgDataToComponent(marker.marker),
        };

        if (marker.route) {
          transformedMarker.route = marker.route;
        }

        if (marker.routeDetails) {
          transformedMarker.routeDetails = {
            icon: marker.routeDetails.icon,
            landmark_name: marker.routeDetails.landmark_name,
            details: marker.routeDetails.details,
            distance: marker.routeDetails.distance,
            time: marker.routeDetails.time,
            img: marker.routeDetails.img,
          };
        }

        return transformedMarker;
      });

      return {
        ...config,
        markers: transformedMarkers,
      };
    });
  }, [filterConfigs]);

  return transformedConfigs;
};
