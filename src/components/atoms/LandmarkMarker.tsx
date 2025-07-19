"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TransformedMarker } from "@/lib/hooks/useFilterConfigs";
import { useLandmark } from "@/lib/hooks/useLandmark";
import LandmarkDetailsCard from "./LandmarkDetailsCard";

interface LandmarkMarkerProps {
  marker: TransformedMarker;
  className?: string;
}

const SvgShapeRenderer = React.memo(
  ({ type, attributes }: { type: string; attributes: any }) => {
    switch (type) {
      case "path":
        return <path {...attributes} />;
      case "circle":
        return <circle {...attributes} />;
      case "rect":
        return <rect {...attributes} />;
      default:
        console.warn(`Unsupported SVG icon type: ${type}`);
        return null;
    }
  }
);
SvgShapeRenderer.displayName = "SvgShapeRenderer";

const LandmarkMarker: React.FC<LandmarkMarkerProps> = ({
  marker,
  className,
}) => {
  const [isSelected, setIsSelected] = useState(false);
  const { selectedLandmarkId, activeRouteId, setLandmarkId } = useLandmark();

  const isTemple = useMemo(
    () => marker.id?.toLowerCase().includes("temple"),
    [marker.id]
  );
  const isMetro = useMemo(
    () => marker.id?.toLowerCase().includes("metro"),
    [marker.id]
  );
  const isClub = useMemo(
    () => marker.id?.toLowerCase().includes("recreation"),
    [marker.id]
  );

  const isBlackoutActive = useMemo(
    () => Boolean(selectedLandmarkId),
    [selectedLandmarkId]
  );
  const isRouteActive = useMemo(
    () => activeRouteId === marker.id,
    [activeRouteId, marker.id]
  );

  const shouldShowIcon = useMemo(
    () => !isBlackoutActive || isRouteActive || isSelected,
    [isBlackoutActive, isRouteActive, isSelected]
  );

  const iconOpacity = useMemo(
    () =>
      (isTemple || isMetro || isClub) && isBlackoutActive && !isSelected
        ? 0.3
        : 1,
    [isTemple, isMetro, isClub, isBlackoutActive, isSelected]
  );

  useEffect(() => {
    setIsSelected(selectedLandmarkId === marker.id);
  }, [selectedLandmarkId, marker.id]);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const newSelectedState = !isSelected;
      setIsSelected(newSelectedState);
      setLandmarkId(newSelectedState ? marker.id : null);
    },
    [isSelected, marker.id, setLandmarkId]
  );

  const routePath = useMemo(
    () => (typeof marker.route === "string" ? marker.route : String(marker.route)),
    [marker.route]
  );

  return (
    <g
      className={`${className} cursor-pointer landmark-icon ${
        isSelected ? "active" : ""
      }`}
      filter="url(#filter0_ii_all)"
      onClick={handleClick}
      style={{
        pointerEvents: "all",
        zIndex: isSelected ? 60 : 10,
        opacity: shouldShowIcon ? 1 : 0.3,
      }}
    >
      <g
        style={{
          pointerEvents: "all",
          cursor: "pointer",
          opacity: iconOpacity,
        }}
      >
        {marker.icon}
      </g>
      <AnimatePresence>
        {isSelected && (
          <>
            {marker.route && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="landmark-route active"
                style={{ zIndex: 60 }}
              >
                <path
                  d={routePath}
                  fill="none"
                  stroke="#ECB92D"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="animate-[drawRoute_3s_ease-in-out_forwards]"
                />

                {marker.routeDetails?.icon && (
                  <motion.g
                    style={{ zIndex: 60 }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                  >
                    <SvgShapeRenderer
                      type={marker.routeDetails.icon.type}
                      attributes={marker.routeDetails.icon.attributes}
                    />
                  </motion.g>
                )}
              </motion.g>
            )}
            {marker.routeDetails && (
              <motion.g
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                style={{ zIndex: 99999999 }}
              >
                <LandmarkDetailsCard routeDetails={marker.routeDetails} />
              </motion.g>
            )}
          </>
        )}
      </AnimatePresence>
    </g>
  );
};

export default React.memo(LandmarkMarker);
