"use client";

import React, { memo, useMemo } from "react";
import { useAppSelector } from "@/lib/store/hooks";
import type { RootState } from "@/lib/store";
import type { Marker, FilterConfig } from "@/lib/store/slices/filterSlice";
import { SchoolIcon } from "./SchoolIcon";
import { TempleIcon } from "./TempleIcon";
import { MetroIcon } from "./MetroIcon";
import { HotelIcon } from "./HotelIcon";
import { HospitalIcon } from "./HospitalIcon";
import { MallsIcon } from "./MallsIcon";
import { RecreationIcon } from "./RecreationIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EntertainmentIcon } from "./EntertainmentIcon";

interface SvgProps {
  className?: string;
}

const BaseMarker = memo(function BaseMarker({
  cx,
  cy,
  fill,
  icon: Icon,
  name,
  id,
  className = "",
  type = "",
  isBlackoutActive = false,
}: {
  cx: number;
  cy: number;
  fill: string;
  icon: React.ComponentType<SvgProps>;
  name: string;
  id: string;
  className?: string;
  type?: string;
  isBlackoutActive?: boolean;
}) {
  const parseMarkerInfo = (id: string) => {
    const match = id.match(/_d_(\d+\.?\d*)_(\d+)/);
    if (match) {
      const [, distance, time] = match;
      return { distance, time };
    }
    return null;
  };

  const markerInfo = parseMarkerInfo(id);
  const shouldReduceOpacity =
    isBlackoutActive &&
    (type === "temple" || type === "metro" || type === "recreation");
  const iconOpacity = shouldReduceOpacity ? 0.2 : 1;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <g
          className={`transform -translate-x-[5px] -translate-y-[5px] ${className}`}
          style={{
            transform: `translate(${cx - 15.5}px, ${cy - 17.5}px)`,
          }}
        >
          <g style={{ opacity: iconOpacity, transition: "opacity 0.3s ease" }}>
            <Icon className={className} />
          </g>
        </g>
      </TooltipTrigger>
      {!shouldReduceOpacity && (
        <TooltipContent side="bottom" align="center">
          <div className="font-bold">{name}</div>
          {markerInfo && (
            <div className="mt-1">
              Distance: {markerInfo.distance}km • Time: {markerInfo.time}min
            </div>
          )}
        </TooltipContent>
      )}
    </Tooltip>
  );
});

const createMarkerComponent = (
  type: string,
  Icon: React.ComponentType<SvgProps>,
  defaultFill: string
) => {
  return memo(function MarkerComponent({ className = "" }: SvgProps) {
    const filterConfigs = useAppSelector(
      (state: RootState) => state.filter.filterConfigs
    );    

    const selectedLandmarkId = useAppSelector(
      (state: RootState) => state.filter.selectedLandmarkId
    );

    const isBlackoutActive = !!selectedLandmarkId;

    const markers = useMemo(() => {
      const result: { cx: number; cy: number; name: string; id: string }[] = [];
      filterConfigs.forEach((config: FilterConfig) => {
        if (config.id === `map-filter-${type}s`) {
          config.markers.forEach((marker: Marker) => {
            if (marker.marker?.type === "circle") {
              result.push({
                cx: marker.marker.attributes.cx,
                cy: marker.marker.attributes.cy,
                name: marker.routeDetails?.landmark_name || marker.id,
                id: marker.id,
              });
            }
          });
        }
      });
      return result;
    }, [filterConfigs, type]);

    return (
      <g id={`${type}s`} className={className} aria-label={`${type} markers`}>
        {markers.map((marker, index) => (
          <BaseMarker
            key={`${type}-${index}`}
            cx={marker.cx}
            cy={marker.cy}
            fill={defaultFill}
            icon={Icon}
            name={marker.name}
            id={marker.id}
            className={className}
            type={type}
            isBlackoutActive={isBlackoutActive}
          />
        ))}
      </g>
    );
  });
};

export const MarkSchools = createMarkerComponent(
  "school",
  SchoolIcon,
  "#078C88"
);
export const MarkTemples = createMarkerComponent(
  "temple",
  TempleIcon,
  "#FFB800"
);
export const MarkMetros = createMarkerComponent("metro", MetroIcon, "#FF6B6B");
export const MarkHotels = createMarkerComponent("hotel", HotelIcon, "#8E7AFF");
export const MarkEntertainment = createMarkerComponent("entertainment", EntertainmentIcon, "#8E7AFF");

export const MarkRecreations = createMarkerComponent(
  "recreation",
  RecreationIcon,
  "#bb531b"
);
export const MarkHospitals = createMarkerComponent(
  "hospital",
  HospitalIcon,
  "#971115"
);
export const MarkMalls = createMarkerComponent("mall", MallsIcon, "#FF4D4D");

// export const ProjectMainSite = memo(function ProjectMainSite({
//   className = "",
// }: SvgProps) {
//   const selectedMapId = useAppSelector((state: RootState) => state.map.selectedMapId);

//   // Dynamic coordinates for each map
//   const getCoordinates = (mapId: string) => {
//     switch (mapId) {
//       case "10km":
//         return { x: 1102, y: 431, cx: 1137.16, cy: 461.11 };
//       case "5km":
//         return { x: 1090, y: 350, cx: 1100, cy: 380 };
//       default:
//         return { x: 1102, y: 431, cx: 1137.16, cy: 461.11 };
//     }
//   };
//   const coords = getCoordinates(selectedMapId);

//   const iconData = {
//     id: "__landmark Project",
//     label: "Project",
//     timeDistance: "30 min | 15 km",
//     textPath: "M1101.79 461.11C1101.79 454.696 1103.36 448.784 1106.51 443.376C1109.65 437.968 1113.96 433.692 1119.43 430.548C1124.9 427.404 1130.81 425.8 1137.16 425.737C1143.51 425.674 1149.43 427.278 1154.9 430.548C1160.37 433.818 1164.68 438.094 1167.82 443.376C1170.96 448.659 1172.54 454.57 1172.54 461.11C1172.54 463.814 1171.88 466.958 1170.55 470.542C1169.23 474.127 1167.57 477.743 1165.56 481.39C1163.54 485.037 1161.25 488.747 1158.67 492.52C1156.09 496.293 1153.58 499.815 1151.12 503.085C1148.67 506.355 1146.38 509.247 1144.24 511.763C1142.1 514.278 1140.4 516.322 1139.14 517.894L1137.16 520.064C1136.66 519.56 1136 518.806 1135.18 517.8C1134.37 516.794 1132.7 514.813 1130.18 511.857C1127.67 508.902 1125.34 505.946 1123.2 502.991C1121.07 500.035 1118.58 496.576 1115.75 492.615C1112.92 488.653 1110.59 484.88 1108.77 481.295C1106.95 477.711 1105.28 474.158 1103.77 470.637C1102.26 467.115 1101.6 463.939 1101.79 461.11ZM1113.58 461.11C1113.58 467.65 1115.88 473.215 1120.47 477.805C1125.06 482.396 1130.62 484.691 1137.16 484.691C1143.7 484.691 1149.27 482.396 1153.86 477.805C1158.45 473.215 1160.75 467.65 1160.75 461.11C1160.75 454.57 1158.45 449.036 1153.86 444.508C1149.27 439.981 1143.7 437.654 1137.16 437.528C1130.62 437.402 1125.06 439.729 1120.47 444.508C1115.88 449.287 1113.58 454.821 1113.58 461.11Z",
//     textPathFill: "#5AC100",
//     iconPath: "M1101.79 461.11C1101.79 454.696 1103.36 448.784 1106.51 443.376C1109.65 437.968 1113.96 433.692 1119.43 430.548C1124.9 427.404 1130.81 425.8 1137.16 425.737C1143.51 425.674 1149.43 427.278 1154.9 430.548C1160.37 433.818 1164.68 438.094 1167.82 443.376C1170.96 448.659 1172.54 454.57 1172.54 461.11C1172.54 463.814 1171.88 466.958 1170.55 470.542C1169.23 474.127 1167.57 477.743 1165.56 481.39C1163.54 485.037 1161.25 488.747 1158.67 492.52C1156.09 496.293 1153.58 499.815 1151.12 503.085C1148.67 506.355 1146.38 509.247 1144.24 511.763C1142.1 514.278 1140.4 516.322 1139.14 517.894L1137.16 520.064C1136.66 519.56 1136 518.806 1135.18 517.8C1134.37 516.794 1132.7 514.813 1130.18 511.857C1127.67 508.902 1125.34 505.946 1123.2 502.991C1121.07 500.035 1118.58 496.576 1115.75 492.615C1112.92 488.653 1110.59 484.88 1108.77 481.295C1106.95 477.711 1105.28 474.158 1103.77 470.637C1102.26 467.115 1101.6 463.939 1101.79 461.11ZM1113.58 461.11C1113.58 467.65 1115.88 473.215 1120.47 477.805C1125.06 482.396 1130.62 484.691 1137.16 484.691C1143.7 484.691 1149.27 482.396 1153.86 477.805C1158.45 473.215 1160.75 467.65 1160.75 461.11C1160.75 454.57 1158.45 449.036 1153.86 444.508C1149.27 439.981 1143.7 437.654 1137.16 437.528C1130.62 437.402 1125.06 439.729 1120.47 444.508C1115.88 449.287 1113.58 454.821 1113.58 461.11Z",
//     iconPathFill: "#5AC100",
//     imageSrc: "/project.webp",
//     imageWidth: 58,
//     imageHeight: 58,
//     imageX: coords.x,
//     imageY: coords.y,
//     clipCenterX: coords.cx,
//     clipCenterY: coords.cy,
//     clipRadius: 26,
//     paths: [
//       {
//         d: "M1101.79 461.11C1101.79 454.696 1103.36 448.784 1106.51 443.376C1109.65 437.968 1113.96 433.692 1119.43 430.548C1124.9 427.404 1130.81 425.8 1137.16 425.737C1143.51 425.674 1149.43 427.278 1154.9 430.548C1160.37 433.818 1164.68 438.094 1167.82 443.376C1170.96 448.659 1172.54 454.57 1172.54 461.11C1172.54 463.814 1171.88 466.958 1170.55 470.542C1169.23 474.127 1167.57 477.743 1165.56 481.39C1163.54 485.037 1161.25 488.747 1158.67 492.52C1156.09 496.293 1153.58 499.815 1151.12 503.085C1148.67 506.355 1146.38 509.247 1144.24 511.763C1142.1 514.278 1140.4 516.322 1139.14 517.894L1137.16 520.064C1136.66 519.56 1136 518.806 1135.18 517.8C1134.37 516.794 1132.7 514.813 1130.18 511.857C1127.67 508.902 1125.34 505.946 1123.2 502.991C1121.07 500.035 1118.58 496.576 1115.75 492.615C1112.92 488.653 1110.59 484.88 1108.77 481.295C1106.95 477.711 1105.28 474.158 1103.77 470.637C1102.26 467.115 1101.6 463.939 1101.79 461.11ZM1113.58 461.11C1113.58 467.65 1115.88 473.215 1120.47 477.805C1125.06 482.396 1130.62 484.691 1137.16 484.691C1143.7 484.691 1149.27 482.396 1153.86 477.805C1158.45 473.215 1160.75 467.65 1160.75 461.11C1160.75 454.57 1158.45 449.036 1153.86 444.508C1149.27 439.981 1143.7 437.654 1137.16 437.528C1130.62 437.402 1125.06 439.729 1120.47 444.508C1115.88 449.287 1113.58 454.821 1113.58 461.11Z",
//         fill: "#5AC100",
//         id: "Vector"
//       }
//     ]
//   };

//   // Use the same rendering logic as LandmarkIcon
//   return (
//     <g id={iconData.id}>
//       {/* Image clip path */}
//       <defs>
//         <clipPath id="project-image-clip">
//           <circle
//             cx={iconData.clipCenterX}
//             cy={iconData.clipCenterY}
//             r={iconData.clipRadius}
//           />
//         </clipPath>
//       </defs>
//       <g>
//         <path
//           d={iconData.iconPath}
//           fill={iconData.iconPathFill}
//           stroke={iconData.iconPathFill}
//           strokeWidth="1.5"
//           strokeMiterlimit="10"
//         />
//         <path
//           fillRule="evenodd"
//           clipRule="evenodd"
//           d={iconData.textPath}
//           fill={iconData.textPathFill}
//         />
//         {iconData.paths &&
//           iconData.paths.map((path, index) => (
//             <path
//               key={`path-${index}`}
//               d={path.d}
//               fill={path.fill}
//             />
//           ))}
//         {/* Render project image on top */}
//         <image
//           href={iconData.imageSrc}
//           x={iconData.imageX}
//           y={iconData.imageY}
//           width={iconData.imageWidth}
//           height={iconData.imageHeight}
//           clipPath="url(#project-image-clip)"
//           preserveAspectRatio="xMidYMid slice"
//         />
//       </g>
//     </g>
//   );
// });
export const ProjectMainSite = memo(function ProjectMainSite({
  className = "",
}: SvgProps) {
  const selectedMapId = useAppSelector((state: RootState) => state.map.selectedMapId);

  // Dynamic coordinates for each map
  const getCoordinates = (mapId: string) => {
    switch (mapId) {
      case "10km":
        return { x: 1136, y: 460, cx: 1137.16, cy: 461.11 };
      case "5km":
        return { x: 856, y: 250, cx: 1100, cy: 380 };
      default:
        return { x: 1102, y: 431, cx: 1137.16, cy: 461.11 };
    }
  };
  const coords = getCoordinates(selectedMapId);

  const iconData = {
    id: "__landmark Project",
    label: "Project",
    timeDistance: "30 min | 15 km",
    textPath: "M1101.79 461.11C1101.79 454.696 1103.36 448.784 1106.51 443.376C1109.65 437.968 1113.96 433.692 1119.43 430.548C1124.9 427.404 1130.81 425.8 1137.16 425.737C1143.51 425.674 1149.43 427.278 1154.9 430.548C1160.37 433.818 1164.68 438.094 1167.82 443.376C1170.96 448.659 1172.54 454.57 1172.54 461.11C1172.54 463.814 1171.88 466.958 1170.55 470.542C1169.23 474.127 1167.57 477.743 1165.56 481.39C1163.54 485.037 1161.25 488.747 1158.67 492.52C1156.09 496.293 1153.58 499.815 1151.12 503.085C1148.67 506.355 1146.38 509.247 1144.24 511.763C1142.1 514.278 1140.4 516.322 1139.14 517.894L1137.16 520.064C1136.66 519.56 1136 518.806 1135.18 517.8C1134.37 516.794 1132.7 514.813 1130.18 511.857C1127.67 508.902 1125.34 505.946 1123.2 502.991C1121.07 500.035 1118.58 496.576 1115.75 492.615C1112.92 488.653 1110.59 484.88 1108.77 481.295C1106.95 477.711 1105.28 474.158 1103.77 470.637C1102.26 467.115 1101.6 463.939 1101.79 461.11ZM1113.58 461.11C1113.58 467.65 1115.88 473.215 1120.47 477.805C1125.06 482.396 1130.62 484.691 1137.16 484.691C1143.7 484.691 1149.27 482.396 1153.86 477.805C1158.45 473.215 1160.75 467.65 1160.75 461.11C1160.75 454.57 1158.45 449.036 1153.86 444.508C1149.27 439.981 1143.7 437.654 1137.16 437.528C1130.62 437.402 1125.06 439.729 1120.47 444.508C1115.88 449.287 1113.58 454.821 1113.58 461.11Z",
    textPathFill: "#479800",
    iconPath: "M1101.79 461.11C1101.79 454.696 1103.36 448.784 1106.51 443.376C1109.65 437.968 1113.96 433.692 1119.43 430.548C1124.9 427.404 1130.81 425.8 1137.16 425.737C1143.51 425.674 1149.43 427.278 1154.9 430.548C1160.37 433.818 1164.68 438.094 1167.82 443.376C1170.96 448.659 1172.54 454.57 1172.54 461.11C1172.54 463.814 1171.88 466.958 1170.55 470.542C1169.23 474.127 1167.57 477.743 1165.56 481.39C1163.54 485.037 1161.25 488.747 1158.67 492.52C1156.09 496.293 1153.58 499.815 1151.12 503.085C1148.67 506.355 1146.38 509.247 1144.24 511.763C1142.1 514.278 1140.4 516.322 1139.14 517.894L1137.16 520.064C1136.66 519.56 1136 518.806 1135.18 517.8C1134.37 516.794 1132.7 514.813 1130.18 511.857C1127.67 508.902 1125.34 505.946 1123.2 502.991C1121.07 500.035 1118.58 496.576 1115.75 492.615C1112.92 488.653 1110.59 484.88 1108.77 481.295C1106.95 477.711 1105.28 474.158 1103.77 470.637C1102.26 467.115 1101.6 463.939 1101.79 461.11ZM1113.58 461.11C1113.58 467.65 1115.88 473.215 1120.47 477.805C1125.06 482.396 1130.62 484.691 1137.16 484.691C1143.7 484.691 1149.27 482.396 1153.86 477.805C1158.45 473.215 1160.75 467.65 1160.75 461.11C1160.75 454.57 1158.45 449.036 1153.86 444.508C1149.27 439.981 1143.7 437.654 1137.16 437.528C1130.62 437.402 1125.06 439.729 1120.47 444.508C1115.88 449.287 1113.58 454.821 1113.58 461.11Z",
    iconPathFill: "#479800",
    imageSrc: "/project.webp",
    imageWidth: 50,
    imageHeight: 50,
    imageX: 1112.16,
    imageY: 436.11,
    clipCenterX: 1137.16,
    clipCenterY: 461.11,
    clipRadius: 26,
    paths: [
      {
        d: "M1101.79 461.11C1101.79 454.696 1103.36 448.784 1106.51 443.376C1109.65 437.968 1113.96 433.692 1119.43 430.548C1124.9 427.404 1130.81 425.8 1137.16 425.737C1143.51 425.674 1149.43 427.278 1154.9 430.548C1160.37 433.818 1164.68 438.094 1167.82 443.376C1170.96 448.659 1172.54 454.57 1172.54 461.11C1172.54 463.814 1171.88 466.958 1170.55 470.542C1169.23 474.127 1167.57 477.743 1165.56 481.39C1163.54 485.037 1161.25 488.747 1158.67 492.52C1156.09 496.293 1153.58 499.815 1151.12 503.085C1148.67 506.355 1146.38 509.247 1144.24 511.763C1142.1 514.278 1140.4 516.322 1139.14 517.894L1137.16 520.064C1136.66 519.56 1136 518.806 1135.18 517.8C1134.37 516.794 1132.7 514.813 1130.18 511.857C1127.67 508.902 1125.34 505.946 1123.2 502.991C1121.07 500.035 1118.58 496.576 1115.75 492.615C1112.92 488.653 1110.59 484.88 1108.77 481.295C1106.95 477.711 1105.28 474.158 1103.77 470.637C1102.26 467.115 1101.6 463.939 1101.79 461.11ZM1113.58 461.11C1113.58 467.65 1115.88 473.215 1120.47 477.805C1125.06 482.396 1130.62 484.691 1137.16 484.691C1143.7 484.691 1149.27 482.396 1153.86 477.805C1158.45 473.215 1160.75 467.65 1160.75 461.11C1160.75 454.57 1158.45 449.036 1153.86 444.508C1149.27 439.981 1143.7 437.654 1137.16 437.528C1130.62 437.402 1125.06 439.729 1120.47 444.508C1115.88 449.287 1113.58 454.821 1113.58 461.11Z",
        fill: "#479800",
        id: "Vector"
      }
    ]
  };

  // Combine passed className with animate-pulse-scale
  const combinedClassName = `animate-pulse-scale ${className}`.trim();

  // Use transform to move the entire icon
  return (
    <g id={iconData.id} className={combinedClassName} transform={`translate(${coords.x - 1137.16}, ${coords.y - 461.11})`}>
      {/* Image clip path */}
      <defs>
        <clipPath id="project-image-clip">
          <circle
            cx={iconData.clipCenterX}
            cy={iconData.clipCenterY}
            r={iconData.clipRadius}
          />
        </clipPath>
      </defs>
      <g>
        <path
          d={iconData.iconPath}
          fill={iconData.iconPathFill}
          stroke={iconData.iconPathFill}
          strokeWidth="1.5"
          strokeMiterlimit="10"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d={iconData.textPath}
          fill={iconData.textPathFill}
        />
        {iconData.paths &&
          iconData.paths.map((path, index) => (
            <path
              key={`path-${index}`}
              d={path.d}
              fill={path.fill}
            />
          ))}
        {/* Render project image on top */}
        <image
          href={iconData.imageSrc}
          x={iconData.imageX}
          y={iconData.imageY}
          width={iconData.imageWidth}
          height={iconData.imageHeight}
          clipPath="url(#project-image-clip)"
          preserveAspectRatio="xMidYMid slice"
        />
      </g>
    </g>
  );
});