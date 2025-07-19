import React, { memo } from "react";
import type {
  HospitalMarker,
  HotelMarker,
  MallMarker,
  SchoolMarker,
  TempleMarker,
  MetroMarker,
  RecreationMarker,
  EntertainmentMarker,
} from "@/lib/types";

type MarkerType =
  | (HospitalMarker & { type: "hospital" })
  | (HotelMarker & { type: "hotel" })
  | (MallMarker & { type: "mall" })
  | (SchoolMarker & { type: "school" })
  | (TempleMarker & { type: "temple" })
  | (MetroMarker & { type: "metro" })
  | (RecreationMarker & { type: "recreation" })
  | (EntertainmentMarker & { type: "entertainment" });

interface SvgMarkerProps {
  marker: MarkerType;
}

const isValidMarker = (marker: unknown): marker is MarkerType => {
  return (
    !!marker &&
    typeof marker === "object" &&
    "id" in marker &&
    "cx" in marker &&
    "cy" in marker
  );
};

const SvgMarker: React.FC<SvgMarkerProps> = ({ marker }) => {
  if (!isValidMarker(marker)) {
    return null;
  }

  const { id, circle, paths } = marker;

  return (
    <g
      key={id}
      id={id}
      className="landmark-icon"
      filter="url(#filter0_ii_all)"
      style={{
        pointerEvents: "all",
        cursor: "pointer",
      }}
    >
      {circle && (
        <circle
          id={circle.id}
          cx={circle.cx}
          cy={circle.cy}
          r={circle.r}
          fill={circle.fill}
        />
      )}
      {paths?.map((path) => (
        <path key={path.id} id={path.id} d={path.d} fill={path.fill} />
      ))}
    </g>
  );
};

export default memo(SvgMarker);
