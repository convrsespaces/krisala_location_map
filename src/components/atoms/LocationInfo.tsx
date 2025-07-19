"use client";

import React, { useMemo, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useLandmark } from "@/lib/hooks/useLandmark";
import { FALLBACK_IMAGES } from "@/lib/constants/images";
import {
  handleImageError,
  getImageSrc,
  preloadImage,
  getLowQualityImageSrc,
  failedImageCache,
} from "@/lib/utils/imageUtils";

interface IconProps {
  className?: string;
}

const LocationIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const TimeIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg
    className={`w-5 h-5 ${className}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

interface RouteDetails {
  landmark_name?: string;
  details?: string;
  icon?: React.ReactNode;
  distance?: string;
  time?: string;
  img?: string;
}

interface LandmarkData {
  routeDetails?: RouteDetails;
}

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

interface LocationInfoProps {
  className?: string;
  landmarks_with_routes?: Record<string, LandmarkData>;
  landmark_val?: LandmarkItem[];
}

// Animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      mass: 0.8,
    },
  },
  exit: {
    opacity: 0,
    y: 20,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

const LocationInfo: React.FC<LocationInfoProps> = ({
  className = "",
  landmarks_with_routes = {},
  landmark_val = [],
}) => {
  const { selectedLandmarkId } = useLandmark();

  const landmarksData = useMemo(() => {
    if (landmark_val.length === 0) return landmarks_with_routes;

    return landmark_val.reduce(
      (acc, landmark) => {
        acc[landmark.id] = {
          routeDetails: {
            landmark_name: landmark.routeDetails.landmark_name,
            details: landmark.routeDetails.details,
            icon: landmark.routeDetails.icon,
            distance: landmark.routeDetails.distance,
            time: landmark.routeDetails.time,
            img: landmark.routeDetails.img,
          },
        };
        return acc;
      },
      {} as Record<string, LandmarkData>
    );
  }, [landmarks_with_routes, landmark_val]);

  // Extract landmark details based on selected ID
  const landmarkDetails = useMemo(() => {
    if (!selectedLandmarkId) return null;
    return landmarksData[selectedLandmarkId]?.routeDetails || null;
  }, [selectedLandmarkId, landmarksData]);

  // Extract individual properties with defaults
  const landmark_name = landmarkDetails?.landmark_name || "Unknown Landmark";
  const details = landmarkDetails?.details || "No details available.";
  const distance = landmarkDetails?.distance || "N/A";
  const time = landmarkDetails?.time || "N/A";

  const [imageSrc, setImageSrc] = useState<
    typeof FALLBACK_IMAGES.LANDMARK | string
  >(FALLBACK_IMAGES.LANDMARK);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  // Preload and set image source
  useEffect(() => {
    const loadImage = async () => {
      if (!selectedLandmarkId) {
        setImageSrc(FALLBACK_IMAGES.LANDMARK);
        setIsHighQualityLoaded(false);
        return;
      }

      // Reset high-quality loaded state
      setIsHighQualityLoaded(false);

      let highQualitySrc: typeof FALLBACK_IMAGES.LANDMARK | string =
        FALLBACK_IMAGES.LANDMARK;

      // First try to get image from landmark details
      if (landmarkDetails?.img) {
        highQualitySrc = getImageSrc(
          landmarkDetails.img,
          FALLBACK_IMAGES.LANDMARK
        );
      } else {
        // Fallback to path-based approach
        highQualitySrc = getImageSrc(
          `/landmarks/${selectedLandmarkId}.webp`,
          FALLBACK_IMAGES.LANDMARK
        );
      }

      // Get low-quality version first
      const lowQualitySrc = getLowQualityImageSrc(highQualitySrc);

      try {
        // First set the low-quality image
        const lowQualityFinalSrc = await preloadImage(lowQualitySrc);
        setImageSrc(lowQualityFinalSrc);

        // Then load the high-quality image
        const img = new window.Image();
        img.onload = () => {
          setImageSrc(highQualitySrc);
          setIsHighQualityLoaded(true);
        };
        img.onerror = () => {
          // If high-quality fails, keep using low-quality
          failedImageCache.add(highQualitySrc);
        };
        img.src = highQualitySrc;
      } catch (error) {
        // If anything fails, use the fallback
        setImageSrc(FALLBACK_IMAGES.LANDMARK);
      }
    };

    loadImage();
  }, [selectedLandmarkId, landmarkDetails]);

  // Handle image error
  const handleImageErrorCallback = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      handleImageError(e, FALLBACK_IMAGES.LANDMARK);
    },
    []
  );

  if (!selectedLandmarkId) {
    return null;
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={`
        ${className}
        fixed bottom-8 left-[300px] z-50 w-lg rounded-xl border border-gray-200/30 bg-white/80
        backdrop-blur-md shadow-lg overflow-hidden
        flex flex-col sm:flex-row
        data-[hidden=true]:hidden
      `}
      role="dialog"
      aria-labelledby="landmark-title"
      aria-describedby="landmark-details"
      tabIndex={-1}
    >
      <div className="relative w-full h-40 sm:h-auto sm:w-48 flex-shrink-0">
        <Image
          src={imageSrc}
          alt={`${landmark_name} landmark`}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 192px"
          loading="eager"
          onError={handleImageErrorCallback}
        />
      </div>

      <motion.div
        className="flex-1 p-4 text-sm bg-white/10 backdrop-blur-sm overflow-y-auto max-h-[200px]"
        variants={contentVariants}
      >
        <motion.h3
          id="landmark-title"
          className="text-lg font-semibold mb-3 text-white"
          variants={itemVariants}
        >
          {landmark_name}
        </motion.h3>

        <motion.div
          className="flex flex-col gap-2 mb-3 text-sm"
          variants={itemVariants}
        >
          <span className="flex items-center gap-2 text-gray-300">
            <LocationIcon className="w-5 h-5" />
            <span className="font-medium">Distance:</span> {distance}
          </span>
          <span className="flex items-center gap-2 text-gray-300">
            <TimeIcon className="w-5 h-5" />
            <span className="font-medium">Time:</span> {time}
          </span>
        </motion.div>

        <motion.div
          id="landmark-details"
          variants={itemVariants}
          className="text-gray-200 text-sm leading-relaxed"
        >
          {details}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

// Use dynamic import with SSR disabled for better performance
export default dynamic(() => Promise.resolve(LocationInfo), {
  ssr: false,
  loading: () => (
    <div className="fixed z-50 max-w-md rounded-xl bg-white/20 backdrop-blur-md shadow-lg overflow-hidden flex flex-col sm:flex-row animate-pulse">
      <div className="relative w-full h-32 sm:h-auto sm:w-40 flex-shrink-0 bg-gray-300"></div>
      <div className="flex-1 p-3">
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-full"></div>
      </div>
    </div>
  ),
});
