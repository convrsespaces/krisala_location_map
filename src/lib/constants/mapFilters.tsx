import MapMarkers from "@/components/molecules/MapMarkers";
import { MapFilter } from "../types";
import { TransformedMarker } from "../hooks/useFilterConfigs";
import {
  mark_hospitals_10km,
  mark_hotels_10km,
  mark_malls_10km,
  mark_schools_10km,
  mark_temples_10km,
  mark_metros_10km,
  mark_recreations_10km,
} from "../data/locations/markerData10km";
import {
  mark_hospitals_5km,
  mark_hotels_5km,
  mark_malls_5km,
  mark_schools_5km,
  mark_temples_5km,
  mark_recreations_5km,
  mark_metros_5km,
  mark_entertainment_5km,
} from "../data/locations/markerData5km";
import { MallsIcon } from "@/components/icons/MallsIcon";
import { HospitalIcon } from "@/components/icons/HospitalIcon";
import { SchoolIcon } from "@/components/icons/SchoolIcon";
import { HotelIcon } from "@/components/icons/HotelIcon";
import { TempleIcon } from "@/components/icons/TempleIcon";
import { RecreationIcon } from "@/components/icons/RecreationIcon";
import { MetroIcon } from "@/components/icons/MetroIcon";
import { LandmarkIcon } from "@/components/icons/LandMarkIcon";
import React from "react";
import { landmarks_10km } from "@/lib/data/routes/LandmarkRoute10km";
import { landmarks_5km } from "@/lib/data/routes/LandmarkRoute5km";
import { landmarks_hyd } from "@/lib/data/routes/LandmarkRouteHyd";
import { EntertainmentIcon } from "@/components/icons/EntertainmentIcon";

interface ExternalLandmarkItem {
  id: string;
  icon: React.ReactNode;
  route: React.ReactElement & { props: { d: string; [key: string]: unknown } };
  routeDetails: {
    icon: React.ReactNode;
    landmark_name: string;
    details: string;
    distance: string;
    time: string;
    img: string;
  };
}

const transformLandmarks = (
  landmarks: ExternalLandmarkItem[]
): TransformedMarker[] => {
  return landmarks.map((landmark) => {
    const routePath = landmark.route?.props?.d || "";
    const icon = React.isValidElement(landmark.icon)
      ? landmark.icon
      : React.createElement("circle", { cx: 0, cy: 0, r: 0 });

    return {
      id: landmark.id,
      icon,
      route: routePath,
      routeDetails: {
        icon: React.isValidElement(landmark.routeDetails.icon)
          ? { type: "path", attributes: { d: "" } }
          : undefined,
        landmark_name: landmark.routeDetails.landmark_name,
        details: landmark.routeDetails.details,
        distance: landmark.routeDetails.distance,
        time: landmark.routeDetails.time,
        img: landmark.routeDetails.img,
      },
    };
  });
};

const getMapData = (mapId: string) => {
  const mapData = {
    "5km": {
      malls: mark_malls_5km,
      hospitals: mark_hospitals_5km,
      schools: mark_schools_5km,
      hotels: mark_hotels_5km,
      temples: mark_temples_5km,
      metros: mark_metros_5km,
      recreations: mark_recreations_5km,
      entertainment: mark_entertainment_5km,
      landmarks: landmarks_5km,
    },
    "10km": {
      malls: mark_malls_10km,
      hospitals: mark_hospitals_10km,
      schools: mark_schools_10km,
      hotels: mark_hotels_10km,
      temples: mark_temples_10km,
      metros: mark_metros_10km,
      recreations: mark_recreations_10km,
      entertainment: [],
      landmarks: landmarks_10km,
    },
    hyd: {
      malls: [],
      hospitals: [],
      schools: [],
      hotels: [],
      temples: [],
      metros: [],
      recreations: [],
      entertainment: [],
      landmarks: landmarks_hyd,
    },
  };

  return (
    mapData[mapId as keyof typeof mapData] || {
      malls: [],
      hospitals: [],
      schools: [],
      hotels: [],
      temples: [],
      metros: [],
      recreations: [],
      entertainment: [],
      landmarks: [],
    }
  );
};

export const createMapFilters = (mapId: string): MapFilter[] => {
  const mapData = getMapData(mapId);

  const filterConfigs: Array<{
    id: string;
    title: string;
    className: string;
    IconComponent: React.ComponentType;
    marks: any;
    isLandmarks?: boolean;
  }> = [
    {
      id: "malls",
      title: "Malls",
      className: "retail",
      IconComponent: MallsIcon,
      marks: mapData.malls,
    },
    {
      id: "hospitals",
      title: "Hospitals",
      className: "hospitals",
      IconComponent: HospitalIcon,
      marks: mapData.hospitals,
    },
    {
      id: "recreations",
      title: "Recreations",
      className: "recreation",
      IconComponent: RecreationIcon,
      marks: mapData.recreations,
    },
    {
      id: "schools",
      title: "Schools",
      className: "education",
      IconComponent: SchoolIcon,
      marks: mapData.schools,
    },
    {
      id: "hotels",
      title: "Hotels",
      className: "hotels",
      IconComponent: HotelIcon,
      marks: mapData.hotels,
    },
    {
      id: "temples",
      title: "Temples",
      className: "temples",
      IconComponent: TempleIcon,
      marks: mapData.temples,
      isLandmarks: false,
    },
    {
      id: "metros",
      title: "Metro",
      className: "metros",
      IconComponent: MetroIcon,
      marks: mapData.metros,
      isLandmarks: false,
    },
    {
      id: "entertainment",
      title: "Entertainment",
      className: "entertainment",
      IconComponent: EntertainmentIcon,
      marks: mapData.entertainment,
      isLandmarks: false,
    },
    {
      id: "landmarks",
      title: "Landmarks",
      className: "landmarks",
      IconComponent: LandmarkIcon,
      marks: transformLandmarks(mapData.landmarks as ExternalLandmarkItem[]),
      isLandmarks: true,
    },
  ];

  return filterConfigs
    .filter(({ marks }) => Array.isArray(marks) && marks.length > 0)
    .map(({ id, title, className, IconComponent, marks, isLandmarks }) => ({
      id: `map-filter-${id}`,
      title,
      className,
      icon: <IconComponent />,
      iconKey: id,
      landmarks: (
        <g className="overlay-can-hide">
          {isLandmarks ? (
            <MapMarkers markers={marks as TransformedMarker[]} mapId={mapId} />
          ) : (
            marks
          )}
        </g>
      ),
    }));
};
