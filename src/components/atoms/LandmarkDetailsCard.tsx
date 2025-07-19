import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TransformedMarker } from "@/lib/hooks/useFilterConfigs";
import { createPortal } from "react-dom";
import { LandmarkDetailsCardProps } from "@/lib/types";
import { getLowQualityImageSrc, preloadHighResImage } from "@/lib/utils/imageUtils";
import { FALLBACK_IMAGES } from "@/lib/constants/images";

const LandmarkDetailsCard: React.FC<LandmarkDetailsCardProps> = ({
  routeDetails,
}) => {
  if (!routeDetails) return null;

  const [mounted, setMounted] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  // Set up initial image sources
  useEffect(() => {
    if (!routeDetails) return;
    
    const highQualitySrc = routeDetails.img || FALLBACK_IMAGES.LANDMARK;
    const lowQualitySrc = getLowQualityImageSrc(highQualitySrc);
    
    // Start with low quality
    setImageSrc(lowQualitySrc);
    setIsHighQualityLoaded(false);
    
    // Load high quality in background
    const img = new window.Image();
    img.onload = () => {
      setImageSrc(highQualitySrc);
      setIsHighQualityLoaded(true);
    };
    img.src = highQualitySrc;
  }, [routeDetails]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const cardContent = (
    <motion.div
      className="fixed bottom-6 left-60 z-[99]"
      style={{
        width: "400px",
        pointerEvents: "auto",
      }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div
        className="bg-black/30 backdrop-blur-sm p-2 rounded-lg shadow-lg"
        style={{
          position: "relative",
          zIndex: 999,
        }}
      >
        <div className="relative w-full h-28">
          <Image
            src={imageSrc || FALLBACK_IMAGES.LANDMARK}
            alt={`${routeDetails.landmark_name || "Landmark"} landmark`}
            fill
            className={`object-cover rounded-md transition-opacity duration-300 ${
              isHighQualityLoaded ? 'opacity-100' : 'opacity-90'
            }`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="eager"
            priority={true}
          />
        </div>
        <h3 className="text-base font-bold text-white mt-1">
          {routeDetails.landmark_name || "Landmark"}
        </h3>
        <div className="flex items-center gap-2">
          {routeDetails.distance && (
            <span className="text-sm font-medium text-gray-100">
              {routeDetails.distance}
            </span>
          )}
          {routeDetails.distance && routeDetails.time && (
            <span className="text-gray-400">•</span>
          )}
          {routeDetails.time && (
            <span className="text-sm font-medium text-gray-100">
              {routeDetails.time}
            </span>
          )}
        </div>
        {routeDetails.details && (
          <p className="text-sm text-gray-100 mt-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent h-20 overflow-auto">
            {routeDetails.details}
          </p>
        )}
      </div>
    </motion.div>
  );

  if (!mounted) return null;

  return typeof document !== "undefined"
    ? createPortal(cardContent, document.body)
    : null;
};

export default LandmarkDetailsCard;
