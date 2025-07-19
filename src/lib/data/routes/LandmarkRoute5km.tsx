import React from "react";
import { motion } from "framer-motion";
import LandmarkIcons5km, { LandmarkIcon, landmarkIcons5km } from "../icons/LandmarkIcons5km";
import CustomTooltip from "@/components/atoms/CustomTooltip";

const COLORS = {
  background: "#0F172A",
  backgroundOpacity: "0.95",
  text: "#F8FAFC",
  routeStroke: "white",
  building: "#e2e8f0",
};

const STROKE_WIDTHS = {
  default: "5",
  thin: "3",
};

const DEFAULT_IMAGE = "/landmarks/gar.webp";

interface LandmarkProps {
  id: string;
  path: string;
  strokeWidth?: string;
  delay?: number;
}

interface LandmarkDetailsProps {
  icon: React.ReactNode;
  distance: string;
  time: string;
  landmark_name: string;
  details: string;
  img?: string;
}

interface LandmarkIconProps {
  id: string;
  x: number;
  y: number;
  name: string;
  buildingPaths?: string[];
}

interface AnimatedLandmarkIconProps {
  landmarkKey: string;
  delay?: number;
}

// Enhanced animated wrapper for landmark icons with tooltips
const AnimatedLandmarkIcon: React.FC<AnimatedLandmarkIconProps> = ({
  landmarkKey,
  delay = 0
}) => {
  // Get the landmark data to extract the label for tooltip
  const landmarkData = landmarkIcons5km[landmarkKey];
  const tooltipContent = landmarkData?.label || landmarkKey;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.9,
        delay: delay,
        ease: "easeOut"
      }}
      whileHover={{ scale: 1.05 }}
      style={{ transformOrigin: "center" }}
    >
      <CustomTooltip content={tooltipContent} placement="top">
        <g style={{ pointerEvents: "all", cursor: "pointer" }}>
          <LandmarkIcon landmarkKey={landmarkKey} />
        </g>
      </CustomTooltip>
    </motion.g>
  );
};

const createLandmark = ({
  id,
  path,
  strokeWidth = STROKE_WIDTHS.default,
  delay = 0,
}: LandmarkProps) => (
  <motion.path
    id={`__route ${id}`}
    d={path}
    stroke={COLORS.routeStroke}
    strokeWidth={strokeWidth}
    fill="none"
    initial={{ pathLength: 0, opacity: 0 }}
    animate={{ pathLength: 1, opacity: 1 }}
    exit={{ pathLength: 0, opacity: 0 }}
    transition={{
      pathLength: { duration: 1.2, delay: delay + 0.8, ease: "easeInOut" },
      opacity: { duration: 1.2, delay: delay + 0.8, ease: "easeOut" }
    }}
  />
);

const createLandmarkDetails = ({
  icon,
  distance,
  time,
  landmark_name,
  details,
  img,
}: LandmarkDetailsProps) => ({
  icon,
  distance,
  time,
  landmark_name,
  details,
  img: img || DEFAULT_IMAGE,
});

export const LandmarkLandmark = {
  mcaInternationalStadium: {
    icon: <AnimatedLandmarkIcon landmarkKey="mcaInternationalStadium" delay={0} />,
    route: createLandmark({
       id: "__route mca international stadium",
      path: "M1097.46 144.778V166.655L1045.79 191V176L1026.5 173L1010 158.5L993.5 141.5L978.5 138.5L969.776 141.5L959.84 149.865L951.394 185.481V222.113L957.355 240L972 256L978.5 277.5L969.776 310.642L957.355 325.906L949.406 328.959L944.935 335.573V350.328L946.425 369.153L943.941 381.364L936.489 395.61L925.062 404.259L899.725 387.469L848.055 345.24L834.145 332.011L848.055 303.011",
      delay: 0,
    }),
    routeDetails: createLandmarkDetails({
      icon: LandmarkIcons5km.mcaInternationalStadium,
      distance: "10 km",
      time: "20 min",
      landmark_name: "MCA International Stadium",
      details:
        "The MCA International Stadium is a cricket stadium located in Hyderabad, India. It is the home ground of the Hyderabad cricket team and has a seating capacity of 55,000.",
      img: `/landmarks/mca_international_stadium.jpg`,
    }),
  },
  kasarsaiDam: {
    icon: <AnimatedLandmarkIcon landmarkKey="kasarsaiDam" delay={0.5} />,
    route: createLandmark({
      id: "__route kasarsai dam",
      path: "M782.094 397.15H818.366L839.235 388.703H857.62H873.023L878.489 381.747L882.961 372.803L839.235 336.034L842.217 328.083L850.167 321.127V307.214",
      delay: 0.5,
    }),
    routeDetails: createLandmarkDetails({
      icon: LandmarkIcons5km.kasarsaiDam,
      distance: "3.5 km",
      time: "10 min",
      landmark_name: "Kasarsai Dam",
      details:
       "Kasarsai Dam is a dam located in the Pune district of Maharashtra, India. It is a popular picnic spot and offers scenic views of the surrounding hills and valleys.",
      img: `/landmarks/kasarsai_dam.jpg`,
    }),
  }
};

interface LandmarkItem {
  icon: React.ReactElement;
  id: string;
  route: React.ReactElement;
  routeDetails: {
    icon: React.ReactNode;
    distance: string;
    time: string;
    landmark_name: string;
    details: string;
    img: string;
  };
}

export const landmarks_5km: LandmarkItem[] = Object.entries(
  LandmarkLandmark
).map(([id, { icon, route, routeDetails }]) => ({
  icon,
  id,
  route,
  routeDetails,
}));
