"use client";

import { recreations } from "@/lib/data/locations/markerData10km";

interface SVGPathAttributes {
  d: string;
  stroke?: string;
  fill?: string;
  strokeWidth?: string;
  strokeOpacity?: string;
  strokeLinecap?: "round" | "butt" | "square" | "inherit";
}

interface SVGCircleAttributes {
  cx: number;
  cy: number;
  r: string | number;
  fill?: string;
}

interface SVGRectAttributes {
  x: string | number;
  y: string | number;
  width: string | number;
  height: string | number;
  fill?: string;
}

type SVGAttributes =
  | { type: "path"; attributes: SVGPathAttributes }
  | { type: "circle"; attributes: SVGCircleAttributes }
  | { type: "rect"; attributes: SVGRectAttributes };

interface Marker {
  id: string;
  marker: SVGAttributes;
  route?: SVGAttributes;
  routeDetails?: {
    icon: SVGAttributes;
    landmark_name?: string;
    details?: string;
    distance?: string;
    time?: string;
    img?: string;
  };
}

const createCircleMarker = (
  location: { id: string; cx: number; cy: number; fill?: string },
  fill: string,
  namePrefix: string
): Marker => ({
  id: location.id,
  marker: {
    type: "circle",
    attributes: {
      cx: location.cx,
      cy: location.cy,
      r: 22.5,
      fill: location.fill || fill,
    },
  },
  routeDetails: {
    landmark_name:
      location.id.split(`__${namePrefix} `)[1]?.split(" _d_")[0] || location.id,
    icon: {
      type: "circle",
      attributes: {
        cx: 0,
        cy: 0,
        r: 10,
        fill,
      },
    },
  },
});

export const loadMarkerData = async (mapId: string) => {
  let hotels: any[] = [];
  let hospitals: any[] = [];
  let malls: any[] = [];
  let schools: any[] = [];
  let temples: any[] = [];
  let metro: any[] = [];
  let recreations: any[] = [];
  let entertainment: any[] = [];
  let landmarks: any[] = [];

  try {
    switch (mapId) {
      case "10km":
        try {
          const markerData = await import(
            "@/lib/data/locations/markerData10km"
          );
          hotels = markerData.hotels || [];
          hospitals = markerData.hospitals || [];
          malls = markerData.malls || [];
          schools = markerData.schools || [];
          temples = markerData.temples || [];
          metro = markerData.metro || [];
          recreations = markerData.recreations || [];
          entertainment = markerData.entertainment || [];

          try {
            const landmarkData = await import(
              "@/lib/data/routes/LandmarkRoute10km"
            );
            landmarks = landmarkData.landmarks_10km || [];
          } catch {
            landmarks = [];
          }
        } catch {}
        break;

      case "5km":
        try {
          try {
            const markerData = await import(
              "@/lib/data/locations/markerData5km"
            );
            hotels = markerData.hotels || [];
            hospitals = markerData.hospitals || [];
            malls = markerData.malls || [];
            schools = markerData.schools || [];
            temples = markerData.temples || [];
            recreations = markerData.recreations || [];
            metro = markerData.metro || [];
            entertainment = markerData.entertainment || [];
          } catch (importError) {
            hotels = [];
            hospitals = [];
            malls = [];
            schools = [];
            temples = [];
            recreations = [];
            metro = [];
            entertainment = [];
          }

          try {
            const landmarkData = await import(
              "@/lib/data/routes/LandmarkRoute5km"
            );
            landmarks = landmarkData.landmarks_5km || [];
          } catch {
            landmarks = [];
          }
        } catch {}
        break;

      case "hyd":
        try {
          hotels = [];
          hospitals = [];
          malls = [];
          recreations = [];
          schools = [];
          temples = [];
          metro = [];
          try {
            const landmarkData = await import(
              "@/lib/data/routes/LandmarkRouteHyd"
            );
            landmarks = landmarkData.landmarks_hyd || [];
          } catch {
            landmarks = [];
          }
        } catch {}
        break;
      default:
        try {
          const markerData = await import(
            "@/lib/data/locations/markerData10km"
          );
          hotels = markerData.hotels || [];
          hospitals = markerData.hospitals || [];
          malls = markerData.malls || [];
          schools = markerData.schools || [];
          temples = markerData.temples || [];
          metro = markerData.metro || [];
          recreations = markerData.recreations || [];
          entertainment = markerData.entertainment || [];
          const landmarkData = await import(
            "@/lib/data/routes/LandmarkRoute10km"
          );
          landmarks = landmarkData.landmarks_10km || [];
        } catch {}
    }
  } catch {
    landmarks = [];
  }

  const hotelMarkers = hotels.map((hotel) =>
    createCircleMarker(hotel, "#8E7AFF", "hotel")
  );

  const hospitalMarkers = hospitals.map((hospital) =>
    createCircleMarker(hospital, "#FF5757", "hospital")
  );
  const recreationMarkers = recreations.map((rec) =>
    createCircleMarker(rec, "#bb531b", "recreation")
  );

  const mallMarkers = malls.map((mall) =>
    createCircleMarker(mall, "#38B407", "mall")
  );

  const schoolMarkers = schools.map((school) =>
    createCircleMarker(school, "#4BA677", "school")
  );

  const templeMarkers = temples.map((temple) =>
    createCircleMarker(temple, "#EDB600", "temple")
  );

  const metroMarkers = metro.map((metroStation) =>
    createCircleMarker(metroStation, "#D40000", "metro")
  );
  const entertainmentMarkers = entertainment.map((entertainment) =>
    createCircleMarker(entertainment, "#D40000", "entertainment")
  );

  const landmarkMarkers = landmarks.map((landmark) => {
    if (!landmark || typeof landmark !== "object") {
      return {
        id: `landmark-${Math.random().toString(36).substring(2, 9)}`,
        marker: {
          type: "circle" as const,
          attributes: {
            cx: 960 + (Math.random() * 200 - 100),
            cy: 540 + (Math.random() * 200 - 100),
            r: 22.5,
            fill: "#FF6B6B",
          },
        },
        routeDetails: {
          landmark_name: "Unknown Landmark",
          details: "No details available",
          distance: "Unknown",
          time: "Unknown",
          img: "/landmarks/gar.webp",
          icon: {
            type: "circle" as const,
            attributes: {
              cx: 0,
              cy: 0,
              r: 10,
              fill: "#FF6B6B",
            },
          },
        },
      };
    }

    if (mapId === "hyd") {
      return {
        id:
          landmark.id ||
          `landmark-${Math.random().toString(36).substring(2, 9)}`,
        marker: landmark.icon || {
          type: "circle" as const,
          attributes: {
            cx: 0,
            cy: 0,
            r: 22.5,
            fill: "#FF6B6B",
          },
        },
        route: landmark.route,
        routeDetails: {
          landmark_name:
            landmark.routeDetails?.landmark_name || "Unknown Landmark",
          details: landmark.routeDetails?.details || "No details available",
          distance: landmark.routeDetails?.distance || "Unknown",
          time: landmark.routeDetails?.time || "Unknown",
          img: landmark.routeDetails?.img || "/landmarks/gar.webp",
          icon: landmark.routeDetails?.icon
            ? {
                type: landmark.routeDetails.icon.type,
                attributes: landmark.routeDetails.icon.attributes,
              }
            : {
                type: "circle" as const,
                attributes: {
                  cx: 0,
                  cy: 0,
                  r: 10,
                  fill: "#FF6B6B",
                },
              },
        },
      };
    }

    return {
      id:
        landmark.id || `landmark-${Math.random().toString(36).substring(2, 9)}`,
      marker: {
        type: "circle" as const,
        attributes: {
          cx: 0,
          cy: 0,
          r: 22.5,
          fill: "#FF6B6B",
        },
      },
      route: landmark.route,
      routeDetails: {
        landmark_name:
          landmark.routeDetails?.landmark_name || "Unknown Landmark",
        details: landmark.routeDetails?.details || "No details available",
        distance: landmark.routeDetails?.distance || "Unknown",
        time: landmark.routeDetails?.time || "Unknown",
        img: landmark.routeDetails?.img || "/landmarks/gar.webp",
        icon: landmark.routeDetails?.icon
          ? {
              type: landmark.routeDetails.icon.type,
              attributes: landmark.routeDetails.icon.attributes,
            }
          : {
              type: "circle" as const,
              attributes: {
                cx: 0,
                cy: 0,
                r: 10,
                fill: "#FF6B6B",
              },
            },
      },
    };
  });

  const filterConfigs = [
    {
      id: "map-filter-hotels",
      title: "Hotels",
      className: "hotels",
      iconKey: "hotels",
      markers: hotelMarkers,
    },
    {
      id: "map-filter-hospitals",
      title: "Hospitals",
      className: "hospitals",
      iconKey: "hospitals",
      markers: hospitalMarkers,
    },
    {
      id: "map-filter-malls",
      title: "Malls",
      className: "malls",
      iconKey: "malls",
      markers: mallMarkers,
    },
    {
      id: "map-filter-schools",
      title: "Schools",
      className: "schools",
      iconKey: "schools",
      markers: schoolMarkers,
    },
    {
      id: "map-filter-landmarks",
      title: "Landmarks",
      className: "landmarks",
      iconKey: "landmarks",
      markers: landmarkMarkers,
    },
    {
      id: "map-filter-temples",
      title: "Temples",
      className: "temples",
      iconKey: "temples",
      markers: templeMarkers,
    },
    {
      id: "map-filter-metros",
      title: "Metro",
      className: "metros",
      iconKey: "metros",
      markers: metroMarkers,
    },
    {
      id: "map-filter-recreations",
      title: "IT Parks",
      className: "recreations",
      iconKey: "recreations",
      markers: recreationMarkers,
    },
    {
      id: "map-filter-entertainments",
      title: "Entertainment",
      className: "entertainment",
      iconKey: "entertainment",
      markers: entertainmentMarkers,
    },
  ];

  const validFilterConfigs = filterConfigs.filter(
    (config) => config.markers.length > 0
  );
  const validFilterIds = validFilterConfigs.map((config) => config.id);
  return {
    filterConfigs: validFilterConfigs,
    activeFilterIds: validFilterIds,
  };
};
