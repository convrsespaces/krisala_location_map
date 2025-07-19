import { Landmark, Route } from "../types";

export interface MapConfig {
  id: string;
  name: string;
  imagePath: string;
  lowQualityImagePath?: string;
  sattelliteImagePath?: string;
  landmarks: Landmark[];
  routes: Route[];
  mainSite: {
    x: number;
    y: number;
  };
}

export const mapsConfig: MapConfig[] = [
  // {
  //   id: "hyd",
  //   name: "Hyderabad Map",
  //   imagePath: "/maps/map-hyd.webp",
  //   lowQualityImagePath: "/maps/hyd-low.webp",
  //   landmarks: [
  //     {
  //       id: "hyd-landmark-1",
  //       name: "Hyderabad Landmark 1",
  //       x: 50,
  //       y: 50,
  //       icon: "🏛️",
  //       description: "Hyderabad Landmark Description 1",
  //     },
  //   ],
  //   routes: [
  //     {
  //       id: "hyd-route-1",
  //       name: "Hyderabad Route 1",
  //       points: [
  //         { x: 50, y: 50 },
  //         { x: 100, y: 100 },
  //       ],
  //       color: "#FF0000",
  //     },
  //   ],
  //   mainSite: {
  //     x: 75,
  //     y: 75,
  //   },
  // },
  {
    id: "10km",
    name: "35KM Map",
    imagePath: "/maps/35km.png",
    lowQualityImagePath: "/maps/10km-low.webp",
    sattelliteImagePath: "/maps/sattellite.webp",
    landmarks: [
      {
        id: "10km-landmark-1",
        name: "10KM Landmark 1",
        x: 70,
        y: 70,
        icon: "🏭",
        description: "10KM Landmark Description 1",
      },
    ],
    routes: [
      {
        id: "10km-route-1",
        name: "10KM Route 1",
        points: [
          { x: 70, y: 70 },
          { x: 140, y: 140 },
        ],
        color: "#0000FF",
      },
    ],
    mainSite: {
      x: 105,
      y: 105,
    },
  },
  {
    id: "5km",
    name: "10KM Map",
    imagePath: "/maps/10km.png",
    lowQualityImagePath: "/maps/5km-low.webp",
    sattelliteImagePath: "/maps/sattelite10.png",
    landmarks: [
      {
        id: "5km-landmark-1",
        name: "5KM Landmark 1",
        x: 60,
        y: 60,
        icon: "🏢",
        description: "5KM Landmark Description 1",
      },
    ],
    routes: [
      {
        id: "5km-route-1",
        name: "5KM Route 1",
        points: [
          { x: 60, y: 60 },
          { x: 120, y: 120 },
        ],
        color: "#00FF00",
      },
    ],
    mainSite: {
      x: 90,
      y: 90,
    },
  },
];
