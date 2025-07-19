import { useState, useEffect } from 'react';

interface UseMapLoadingAnimationProps {
  isLoading: boolean;
  hasError: boolean;
}

interface UseMapLoadingAnimationReturn {
  loadingProgress: number;
  showMap: boolean;
  setShowMap: (show: boolean) => void;
  handleLoadingComplete: () => void;
}

/**
 * Custom hook to handle map loading animation logic
 */
export function useMapLoadingAnimation({
  isLoading,
  hasError
}: UseMapLoadingAnimationProps): UseMapLoadingAnimationReturn {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showMap, setShowMap] = useState(false);
  
  // Simulate loading progress
  useEffect(() => {
    let initialInterval: NodeJS.Timeout;
    let finalInterval: NodeJS.Timeout;
    let timer: NodeJS.Timeout;
    
    if (isLoading) {
      setShowMap(false);
      setLoadingProgress(0);
      
      // Start with faster progress up to 70%
      initialInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 70) {
            clearInterval(initialInterval);
            return prev;
          }
          return Math.min(70, prev + Math.random() * 5);
        });
      }, 200);
      
      // Then slow down to wait for actual data
      timer = setTimeout(() => {
        clearInterval(initialInterval);
        finalInterval = setInterval(() => {
          setLoadingProgress(prev => {
            if (!isLoading && prev >= 100) {
              clearInterval(finalInterval);
              return 100;
            }
            return Math.min(99, prev + Math.random() * 0.5);
          });
        }, 300);
      }, 2000);
    } else if (!hasError) {
      // When loading completes, set progress to 100%
      setLoadingProgress(100);
      
      // Small delay before showing the map for smooth transition
      timer = setTimeout(() => {
        setShowMap(true);
      }, 500);
    }
    
    return () => {
      clearInterval(initialInterval);
      clearInterval(finalInterval);
      clearTimeout(timer);
    };
  }, [isLoading, hasError]);
  
  // Handle loading animation complete
  const handleLoadingComplete = () => {
    if (!isLoading && !hasError) {
      setShowMap(true);
    }
  };
  
  return {
    loadingProgress,
    showMap,
    setShowMap,
    handleLoadingComplete
  };
}

export default useMapLoadingAnimation;