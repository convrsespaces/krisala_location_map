"use client";

import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { getMapImage } from "@/lib/utils/mapUtils";
import MapMarkers from "./MapMarkers";
import { useInitializeMap } from "@/lib/hooks/useInitializeMap";
import { useAppDispatch } from "@/lib/store/hooks";
import { loadFilterData } from "@/lib/store/slices/filterSlice";
import MapLoadingScreen from "./MapLoadingScreen";
import { motion, AnimatePresence } from "framer-motion";
import useMapLoadingAnimation from "@/lib/hooks/useMapLoadingAnimation";
import { useMapPreloader } from "@/lib/hooks/useMapPreloader";
import { generateBlurPlaceholder, getCachedImage } from "@/lib/utils/imagePreloader";
import { mapsConfig } from "@/config/maps";

interface MapProps {
  mapId: string;
  className?: string;
}

const Map: React.FC<MapProps> = ({ mapId, className = "" }) => {
  const dispatch = useAppDispatch();
  const { isLoading, error, hasFilterData } = useInitializeMap();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [useLowQuality, setUseLowQuality] = useState(true);
  
  // Use our custom hooks for loading states
  const { 
    loadingProgress, 
    showMap, 
    handleLoadingComplete 
  } = useMapLoadingAnimation({
    isLoading,
    hasError: !!error
  });
  
  const { isCurrentMapPreloaded, loadingProgress: preloadProgress, isInitialLoad } = useMapPreloader(mapId);
  
  // Load filter data when map ID changes
  useEffect(() => {
    dispatch(loadFilterData(mapId));
  }, [mapId, dispatch]);
  
  // Reset states when map changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
    setUseLowQuality(true);
  }, [mapId]);
  
  // Handle image load
  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
    
    // If we're using low quality image and the high quality is preloaded, switch to it
    if (useLowQuality && isCurrentMapPreloaded) {
      setUseLowQuality(false);
    }
  }, [useLowQuality, isCurrentMapPreloaded]);
  
  // Handle image error
  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/fallback-map.png';
    setImageLoaded(true);
    setImageError(true);
  }, []);
  
  // Show error state
  if (error) {
    return (
      <div className={`relative w-full h-full ${className} flex items-center justify-center bg-gray-100`}>
        <div className="text-center text-red-500 p-4 bg-white/80 rounded-lg shadow-lg">
          <p className="font-bold text-lg">Error Loading Map</p>
          <p className="text-sm mt-2">{error}</p>
          <button 
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
            onClick={() => dispatch(loadFilterData(mapId))}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  const mapConfig = mapsConfig.find(map => map.id === mapId);
  const mapImage = useLowQuality && mapConfig?.lowQualityImagePath 
    ? mapConfig.lowQualityImagePath 
    : getMapImage(mapId);
  const cachedImage = getCachedImage(mapImage);
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      <AnimatePresence>
        {isLoading || !showMap ? (
          <MapLoadingScreen
            progress={Math.max(loadingProgress, preloadProgress)}
            message={`Loading ${mapId.toUpperCase()} map data...`}
            onAnimationComplete={handleLoadingComplete}
            mapImage={mapConfig?.lowQualityImagePath}
          />
        ) : null}
      </AnimatePresence>
      
      <motion.div 
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded && showMap ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={mapImage}
          alt={`${mapId.toUpperCase()} Map`}
          fill
          priority
          quality={useLowQuality ? 50 : 85}
          loading="eager"
          fetchPriority="high"
          placeholder="blur"
          blurDataURL={generateBlurPlaceholder('#e5e7eb')}
          sizes="100vw"
          className={`object-cover brightness-[0.98] contrast-[1.02] transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          unoptimized={isCurrentMapPreloaded || !!cachedImage}
        />
        
        {imageLoaded && showMap && !imageError && (
          <MapMarkers mapId={mapId} />
        )}
        
        {/* Debug overlay */}
        {process.env.NODE_ENV !== 'production' && (
          <div className="absolute bottom-0 left-0 bg-black/70 text-white p-2 text-xs z-50">
            Map ID: {mapId} | Filter Data: {hasFilterData ? 'Loaded' : 'Not Loaded'} | 
            Preloaded: {isCurrentMapPreloaded ? 'Yes' : 'No'} | 
            Cached: {cachedImage ? 'Yes' : 'No'} |
            Quality: {useLowQuality ? 'Low' : 'High'} |
            Initial Load: {isInitialLoad ? 'Yes' : 'No'}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Map;