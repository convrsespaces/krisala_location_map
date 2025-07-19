"use client";

import React, { useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLandmark } from "@/lib/hooks/useLandmark";
import { TransformedMarker } from "@/lib/hooks/useFilterConfigs";
import { getMapData } from "@/lib/utils/mapUtils";
import { useFilteredMarkers } from "@/lib/hooks/useFilteredMarkers";

const MapMarker = dynamic(() => import("../atoms/MapMarker"), { 
  ssr: false,
  loading: () => (
    <div className="w-6 h-6 bg-gray-200 animate-pulse rounded-full" />
  )
});

const LandmarkMarker = dynamic(() => import("../atoms/LandmarkMarker"), {
  ssr: false,
  loading: () => (
    <div className="w-6 h-6 bg-gray-200 animate-pulse rounded-full" />
  )
});

interface MapMarkersProps {
  markers?: TransformedMarker[];
  mapId: string;
}

const groupVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const MapMarkers: React.FC<MapMarkersProps> = ({ markers = [], mapId }) => {
  const { selectedLandmarkId, setLandmarkId } = useLandmark();
  const { filteredMarkers } = useFilteredMarkers();
  const mapData = getMapData(mapId);

  const displayMarkers = useMemo(() => {
    if (markers.length > 0) return markers;
    if (filteredMarkers.length > 0) return filteredMarkers;
    return mapData.markers || [];
  }, [markers, filteredMarkers, mapData]);

  useEffect(() => {
    setLandmarkId(null);
  }, [mapId, setLandmarkId]);

  return (
    <svg className="absolute inset-0 size-full" viewBox="0 0 1920 1080" style={{ isolation: "isolate" }}>
      <defs>
        <filter
          id="filter0_ii_all"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"
          />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="-1" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_innerShadow"
            result="effect2_innerShadow"
          />
        </filter>
      </defs>

      {/* Global blackout overlay */}
      <AnimatePresence>
        {selectedLandmarkId && (
          <motion.rect
            width="100%"
            height="100%"
            fill="#1f2937"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setLandmarkId(null)}
            className="cursor-pointer blackout-overlay"
            style={{ zIndex: 50 }}
          />
        )}
      </AnimatePresence>

      <motion.g
        variants={groupVariants}
        initial="hidden"
        animate="visible"
        transition={{ duration: 0.3 }}
        className="pointer-events-auto"
      >
        {displayMarkers.length > 0 ? (
          <>
            {displayMarkers
              .filter(
                (marker: TransformedMarker) =>
                  !marker.route && !marker.routeDetails
              )
              .map((marker: TransformedMarker) => (
                <MapMarker
                  key={marker.id}
                  marker={marker}
                  id={marker.id}
                  className="z-10"
                />
              ))}
            {displayMarkers
              .filter(
                (marker: TransformedMarker) =>
                  marker.route ||
                  marker.routeDetails ||
                  marker.id?.toLowerCase().includes("landmark")
              )
              .map((marker: TransformedMarker) => (
                <LandmarkMarker
                  key={marker.id}
                  marker={marker}
                  className="z-20"
                />
              ))}
          </>
        ) : (
          <text x="960" y="540" textAnchor="middle" fill="white" fontSize="24">
            No markers available
          </text>
        )}
      </motion.g>
    </svg>
  );
};

export default React.memo(MapMarkers);
