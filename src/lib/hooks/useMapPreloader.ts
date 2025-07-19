import { useState, useEffect } from 'react';
import { preloadAllMapImages } from '@/lib/utils/imagePreloader';
import { mapsConfig } from '@/config/maps';

/**
 * Custom hook to handle map preloading with progressive loading and caching
 * @param currentMapId The ID of the currently selected map
 * @returns Object containing loading state and preloaded map IDs
 */
export function useMapPreloader(currentMapId: string) {
  const [preloadedMaps, setPreloadedMaps] = useState<Set<string>>(new Set());
  const [isCurrentMapPreloaded, setIsCurrentMapPreloaded] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Preload maps when component mounts or currentMapId changes
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Reset states when map changes
    setIsCurrentMapPreloaded(false);
    setLoadingProgress(0);
    
    // Create a new Image object for the current map
    const img = new Image();
    
    // Set loading attributes for better performance
    img.loading = 'eager';
    img.decoding = 'async';
    img.fetchPriority = 'high';
    
    // Load the current map with high priority
    img.onload = () => {
      setPreloadedMaps(prev => {
        const newSet = new Set([...prev, currentMapId]);
        setIsCurrentMapPreloaded(true);
        setLoadingProgress(100);
        setIsInitialLoad(false);
        return newSet;
      });
    };
    
    img.onerror = () => {
      // Still mark as attempted even on error
      setPreloadedMaps(prev => new Set([...prev, currentMapId]));
      setIsCurrentMapPreloaded(true);
      setLoadingProgress(100);
      setIsInitialLoad(false);
    };
    
    // Start loading the current map
    const mapConfig = mapsConfig.find(map => map.id === currentMapId);
    if (mapConfig) {
      // For initial load, try to load a lower quality version first
      if (isInitialLoad && mapConfig.lowQualityImagePath) {
        img.src = mapConfig.lowQualityImagePath;
      } else {
        img.src = mapConfig.imagePath;
      }
    }
    
    // Add a listener for page visibility to optimize loading
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // When page becomes visible, ensure current map is loaded
        if (!isCurrentMapPreloaded) {
          const mapConfig = mapsConfig.find(map => map.id === currentMapId);
          if (mapConfig) {
            img.src = mapConfig.imagePath;
          }
        }
      }
    };
    
    // Add a listener for network status to reload images if needed
    const handleOnline = () => {
      if (!isCurrentMapPreloaded) {
        const mapConfig = mapsConfig.find(map => map.id === currentMapId);
        if (mapConfig) {
          img.src = mapConfig.imagePath;
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [currentMapId, isInitialLoad]);
  
  // Preload other maps in the background when idle
  useEffect(() => {
    if (typeof window === 'undefined' || !isCurrentMapPreloaded) return;
    
    const preloadRemainingMaps = () => {
      const remainingMaps = mapsConfig
        .filter(map => !preloadedMaps.has(map.id) && map.id !== currentMapId);
      
      if (remainingMaps.length === 0) return;
      
      const loadNextMap = (index: number) => {
        if (index >= remainingMaps.length) return;
        
        const map = remainingMaps[index];
        const img = new Image();
        
        // Set loading attributes for better performance
        img.loading = 'lazy';
        img.decoding = 'async';
        img.fetchPriority = 'low';
        
        img.onload = () => {
          setPreloadedMaps(prev => new Set([...prev, map.id]));
          // Load next map after a small delay
          setTimeout(() => loadNextMap(index + 1), 100);
        };
        
        img.onerror = () => {
          setPreloadedMaps(prev => new Set([...prev, map.id]));
          // Continue with next map even on error
          setTimeout(() => loadNextMap(index + 1), 100);
        };
        
        // For initial load, try to load low quality versions first
        if (isInitialLoad && map.lowQualityImagePath) {
          img.src = map.lowQualityImagePath;
        } else {
          img.src = map.imagePath;
        }
      };
      
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => loadNextMap(0), { timeout: 2000 });
      } else {
        setTimeout(() => loadNextMap(0), 1000);
      }
    };
    
    preloadRemainingMaps();
  }, [isCurrentMapPreloaded, preloadedMaps, currentMapId, isInitialLoad]);
  
  return {
    preloadedMaps,
    isCurrentMapPreloaded,
    loadingProgress,
    isInitialLoad,
    isMapPreloaded: (mapId: string) => preloadedMaps.has(mapId)
  };
}

export default useMapPreloader;