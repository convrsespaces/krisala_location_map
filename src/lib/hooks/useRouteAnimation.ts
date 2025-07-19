import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { getHighwaysForMap } from "@/lib/data/routes/HighwayRoutes";
import { isMapAnimated, markMapAsAnimated } from "@/lib/data/routeAnimationStorage";

type Phase = "video" | "map-loading" | "route-tracing" | "route-fading" | "interactive";

const ROUTE_CONFIG = {
  fadeOutDelay: 1000,
  fadeOutDuration: 1500,
  mapLoadDelay: 300,
  interactiveDelay: 800, // ✅ NEW: Delay for maps that don't need animation
} as const;

export const useRouteAnimation = (selectedMapId: string, isMapLoaded: boolean) => {
  const [phase, setPhase] = useState<Phase>("video");
  const [completedCount, setCompletedCount] = useState(0);
  
  // Track all timers for proper cleanup
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const currentMapRef = useRef<string>(selectedMapId);

  const highways = useMemo(() => getHighwaysForMap(selectedMapId), [selectedMapId]);
  const shouldAnimate = useMemo(
    () => !isMapAnimated(selectedMapId) && highways.length > 0,
    [selectedMapId, highways.length]
  );

  // Cleanup function to clear all timers
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // Safe setState that only updates if we're still on the same map
  const safeSetPhase = useCallback((newPhase: Phase) => {
    if (currentMapRef.current === selectedMapId) {
      setPhase(newPhase);
    }
  }, [selectedMapId]);

  // Reset when map changes
  useEffect(() => {
    // Clear all previous timers immediately
    clearAllTimers();
    
    // Update current map reference
    currentMapRef.current = selectedMapId;
    
    // Reset state
    setCompletedCount(0);
    
    // ✅ ALWAYS start with map-loading, regardless of animation need
    setPhase("map-loading");
  }, [selectedMapId, clearAllTimers]);

  // ✅ UPDATED: Handle both animated and non-animated maps
  useEffect(() => {
    if (phase === "map-loading" && isMapLoaded) {
      if (shouldAnimate) {
        // Maps that need route animation
        const timer = setTimeout(() => {
          safeSetPhase("route-tracing");
        }, ROUTE_CONFIG.mapLoadDelay);
        
        timersRef.current.push(timer);
        
        return () => {
          clearTimeout(timer);
          timersRef.current = timersRef.current.filter(t => t !== timer);
        };
      } else {
        // ✅ Maps that don't need animation - still add delay
        const timer = setTimeout(() => {
          safeSetPhase("interactive");
        }, ROUTE_CONFIG.interactiveDelay);
        
        timersRef.current.push(timer);
        
        return () => {
          clearTimeout(timer);
          timersRef.current = timersRef.current.filter(t => t !== timer);
        };
      }
    }
  }, [phase, isMapLoaded, shouldAnimate, safeSetPhase]);

  const handleRouteComplete = useCallback(() => {
    // Only proceed if we're still on the same map and in the right phase
    if (currentMapRef.current !== selectedMapId || phase !== "route-tracing") {
      return;
    }

    setCompletedCount((prev) => {
      const newCount = prev + 1;
      
      if (newCount >= highways.length) {
        markMapAsAnimated(selectedMapId);
        
        // Schedule fade transition with proper cleanup tracking
        const fadeTimer = setTimeout(() => {
          if (currentMapRef.current === selectedMapId) {
            safeSetPhase("route-fading");
            
            const interactiveTimer = setTimeout(() => {
              if (currentMapRef.current === selectedMapId) {
                safeSetPhase("interactive");
              }
            }, ROUTE_CONFIG.fadeOutDuration);
            
            timersRef.current.push(interactiveTimer);
          }
        }, ROUTE_CONFIG.fadeOutDelay);
        
        timersRef.current.push(fadeTimer);
      }
      
      return newCount;
    });
  }, [highways.length, selectedMapId, phase, safeSetPhase]);

  // Cleanup on unmount or map change
  useEffect(() => {
    return clearAllTimers;
  }, [clearAllTimers]);

  return {
    animationPhase: phase,
    setAnimationPhase: setPhase,
    currentHighways: highways,
    handleRouteComplete,
    shouldShowRoutes: phase === "route-tracing" || phase === "route-fading",
    shouldFadeRoutes: phase === "route-fading",
    isInteractive: phase === "interactive",
  };
};