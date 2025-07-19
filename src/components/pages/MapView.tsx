"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { useLandmark } from "@/lib/hooks/useLandmark";
import { createMapFilters } from "@/lib/constants/mapFilters";
import { FALLBACK_IMAGES } from "@/lib/constants/images";
import {
  ProjectMainSite,
  MarkTemples,
  MarkMetros,
  MarkSchools,
  MarkHotels,
  MarkHospitals,
  MarkMalls,
  MarkRecreations,
  MarkEntertainment,
} from "@/components/icons/MapSvgIcons";
import CollapsiblePanel from "../molecules/CollapsiblePanel";
import {MapSwitcher, MapSwitcherVariants} from "@/components/molecules/MapSwitcher";
import { mapsConfig } from "@/config/maps";
import { lazy } from "react";
import {
  RiFullscreenExitFill,
  RiFullscreenFill,
  RiMap2Line,
} from "react-icons/ri";
import { generateBlurPlaceholder } from "@/lib/utils/imagePreloader";
import useMapPreloader from "@/lib/hooks/useMapPreloader";
import useIntroVideo from "@/lib/hooks/useIntroVideo";
import { getHighwaysForMap, type Highway } from "@/lib/data/routes/HighwayRoutes";
import Compass from "../atoms/Compass";
import { EntertainmentIcon } from "../icons/EntertainmentIcon";

const MapFilterComponent = lazy(
  () => import("@/components/molecules/MapFilter")
);

// Route configuration
const ROUTE_CONFIG = {
  color: "#FFEA00", 
  strokeWidth: 4,
  glowWidth: 7,
  fadeOutDuration: 0,
  fadeOutDelay: 0
} as const;

// AnimatedPath component with proper timer cleanup
interface AnimatedPathProps {
  highway: Highway;
  onComplete?: () => void;
  shouldFadeOut?: boolean;
}

const AnimatedPath: React.FC<AnimatedPathProps> = ({
  highway,
  onComplete,
  shouldFadeOut = false
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const currentHighwayRef = useRef(highway);

  // Update current highway reference
  useEffect(() => {
    currentHighwayRef.current = highway;
  }, [highway]);

  // Cleanup function
  const cleanup = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);
  

  useEffect(() => {
    // Reset state for new highway
    hasStartedRef.current = false;
    hasCompletedRef.current = false;
    cleanup();

    const pathElement = pathRef.current;
    const glowElement = glowRef.current;
    if (!pathElement || !highway?.path) return;

    const startTimer = setTimeout(() => {
      // Check if this is still the current highway
      if (currentHighwayRef.current !== highway) return;
      
      hasStartedRef.current = true;
      
      try {
        const length = pathElement.getTotalLength();
        
        [pathElement, glowElement].forEach(el => {
          if (el) {
            el.style.transition = "none";
            el.style.strokeDasharray = `${length} ${length}`;
            el.style.strokeDashoffset = `${length}`;
          }
        });
        
        pathElement.getBoundingClientRect();
        
        requestAnimationFrame(() => {
          // Check again if this is still the current highway
          if (currentHighwayRef.current !== highway) return;
          
          [pathElement, glowElement].forEach(el => {
            if (el) {
              el.style.transition = `stroke-dashoffset ${highway.duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
              el.style.strokeDashoffset = "0";
            }
          });
        });

        const completeTimer = setTimeout(() => {
          // Only complete if this is still the current highway
          if (currentHighwayRef.current === highway && !hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onComplete?.();
          }
        }, highway.duration);

        timersRef.current.push(completeTimer);
      } catch (error) {
        console.warn("Path animation failed:", error);
        if (currentHighwayRef.current === highway && !hasCompletedRef.current) {
          hasCompletedRef.current = true;
          onComplete?.();
        }
      }
    }, highway.startDelay);

    timersRef.current.push(startTimer);

    // Cleanup when highway changes or unmounts
    return cleanup;
  }, [highway, onComplete, cleanup]);

  if (!highway?.path) return null;

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: shouldFadeOut ? ROUTE_CONFIG.fadeOutDuration / 1000 : 0.3,
        ease: "easeOut"
      }}
      className="pointer-events-none"
      role="presentation"
      aria-hidden="true"
    >
      {/* Glow effect */}
      <path
        ref={glowRef}
        d={highway.path}
        fill="none"
        stroke={ROUTE_CONFIG.color}
        strokeWidth={ROUTE_CONFIG.glowWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-40"
        style={{ filter: 'blur(3px)' }}
      />
      {/* Main path */}
      <path
        ref={pathRef}
        d={highway.path}
        fill="none"
        stroke={ROUTE_CONFIG.color}
        strokeWidth={ROUTE_CONFIG.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-sm"
      />
    </motion.g>
  );
};

// Simple animation states for better maintainability
type AnimationPhase = 'video' | 'map-loading' | 'route-tracing' | 'route-fading' | 'interactive';

// Custom hook for route animation logic with proper cleanup
const useRouteAnimation = (selectedMapId: string, isMapLoaded: boolean) => {
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>('video');
  const [completedRoutes, setCompletedRoutes] = useState(0);
  const animatedMapsRef = useRef<Set<string>>(new Set());
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const currentMapRef = useRef<string>(selectedMapId);

  const currentHighways = useMemo(() => getHighwaysForMap(selectedMapId), [selectedMapId]);
  const shouldAnimate = !animatedMapsRef.current.has(selectedMapId) && currentHighways.length > 0;

  // Cleanup function
  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  // Safe setState that only updates if we're still on the same map
  const safeSetPhase = useCallback((newPhase: AnimationPhase) => {
    if (currentMapRef.current === selectedMapId) {
      setAnimationPhase(newPhase);
    }
  }, [selectedMapId]);

  // Reset when map changes
  useEffect(() => {
    // Clear all previous timers immediately
    clearAllTimers();
    
    // Update current map reference
    currentMapRef.current = selectedMapId;
    
    // Reset state
    setCompletedRoutes(0);

    if (!animatedMapsRef.current.has(selectedMapId)) {
      safeSetPhase('map-loading');
    } else {
      safeSetPhase('interactive');
    }
  }, [selectedMapId, clearAllTimers, safeSetPhase]);

  // Start animation when map loads
  useEffect(() => {
    if (animationPhase === 'map-loading' && isMapLoaded) {
      if (shouldAnimate) {
        const timer = setTimeout(() => safeSetPhase('route-tracing'), 300);
        timersRef.current.push(timer);
        
        return () => {
          clearTimeout(timer);
          timersRef.current = timersRef.current.filter(t => t !== timer);
        };
      } else {
        safeSetPhase('interactive');
      }
    }
  }, [animationPhase, isMapLoaded, shouldAnimate, safeSetPhase]);

  const handleRouteComplete = useCallback(() => {
    // Only proceed if we're still on the same map and in the right phase
    if (currentMapRef.current !== selectedMapId || animationPhase !== 'route-tracing') {
      return;
    }

    setCompletedRoutes(prev => {
      const newCount = prev + 1;
      if (newCount >= currentHighways.length) {
        animatedMapsRef.current.add(selectedMapId);
        
        const fadeTimer = setTimeout(() => {
          if (currentMapRef.current === selectedMapId) {
            safeSetPhase('route-fading');
            
            const interactiveTimer = setTimeout(() => {
              if (currentMapRef.current === selectedMapId) {
                safeSetPhase('interactive');
              }
            }, ROUTE_CONFIG.fadeOutDuration);
            
            timersRef.current.push(interactiveTimer);
          }
        }, ROUTE_CONFIG.fadeOutDelay);
        
        timersRef.current.push(fadeTimer);
      }
      return newCount;
    });
  }, [currentHighways.length, selectedMapId, animationPhase, safeSetPhase]);

  // Cleanup on unmount
  useEffect(() => {
    return clearAllTimers;
  }, [clearAllTimers]);

  return {
    animationPhase,
    setAnimationPhase,
    currentHighways,
    handleRouteComplete,
    shouldShowRoutes: animationPhase === 'route-tracing' || animationPhase === 'route-fading',
    shouldFadeRoutes: animationPhase === 'route-fading',
    isInteractive: animationPhase === 'interactive'
  };
};

const variants = {
  main: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  panel: {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  },
  controls: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.2 } },
  },
};

const Placeholders = {
  LocationInfo: () => (
    <div className="w-80 h-32 bg-white/20 backdrop-blur-sm animate-pulse rounded-xl shadow-sm" />
  ),
  MapFilter: () => (
    <div className="w-full h-64 bg-white/20 backdrop-blur-sm animate-pulse rounded-lg shadow-sm" />
  ),
};

const ControlButton = React.memo(
  ({
    onClick,
    disabled,
    ariaLabel,
    icon,
    text,
  }: {
    onClick: () => void;
    disabled?: boolean;
    ariaLabel: string;
    icon: React.ReactNode;
    text: string;
  }) => (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white/80 group hover:shadow-md transition-all duration-200 flex items-center gap-2.5 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {icon}
      <span className="text-sm font-medium text-white group-hover:text-black">{text}</span>
    </button>
  )
);
ControlButton.displayName = "ControlButton";

const overlayComponents = {
  "map-filter-temples": MarkTemples,
  "map-filter-metros": MarkMetros,
  "map-filter-schools": MarkSchools,
  "map-filter-hotels": MarkHotels,
  "map-filter-hospitals": MarkHospitals,
  "map-filter-malls": MarkMalls,
  "map-filter-recreations": MarkRecreations,
  "map-filter-entertainments": MarkEntertainment
};

const MapView: React.FC = () => {
  const { selectedLandmarkId, setLandmarkId } = useLandmark();
  const selectedMapId = useAppSelector((state) => state.map?.selectedMapId) || mapsConfig[0].id;
  const selectedMap = mapsConfig.find((m) => m.id === selectedMapId) || mapsConfig[0];
  const activeMapFilterIds = useAppSelector((state) => state.filter.activeMapFilterIds);
  
  // ✅ FIXED: All useState hooks must be declared at the top level, in the same order every time
  const [showOverlays, setShowOverlays] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [visibleOverlayIds, setVisibleOverlayIds] = useState<Set<string>>(new Set());
  const [showMainSite, setShowMainSite] = useState(false);
  const [showLandmarks, setShowLandmarks] = useState(false);
  const [lastInteractiveMapId, setLastInteractiveMapId] = useState(selectedMapId); // ✅ MOVED TO TOP
  const [selectedMapIds, setSelectedMapIds] = useState<boolean>(false);
  
  // ✅ All useRef hooks
  const progressiveTimersRef = useRef<NodeJS.Timeout[]>([]);
  
  // ✅ All custom hooks
  const {
    animationPhase,
    setAnimationPhase,
    currentHighways,
    handleRouteComplete,
    shouldShowRoutes,
    shouldFadeRoutes,
    isInteractive
  } = useRouteAnimation(selectedMapId, isMapLoaded);
  
  const { showIntroVideo, hasVideoCompleted, handleVideoComplete } = useIntroVideo({
    videoUrl: "https://cdn.yoursite.com/intro-video.mp4",
    enableIntro: true,
  });

  const { isCurrentMapPreloaded } = useMapPreloader(selectedMapId);

  // ✅ All useEffect hooks after useState and custom hooks
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ All useMemo hooks
  const mapFilters = useMemo(() => createMapFilters(selectedMapId), [selectedMapId]);

  // Handle video completion
  useEffect(() => {
    if (hasVideoCompleted && animationPhase === 'video') {
      setAnimationPhase('map-loading');
    }
  }, [hasVideoCompleted, animationPhase, setAnimationPhase]);

  // Update lastInteractiveMapId only when isInteractive is true for the current map
  useEffect(() => {
    if (isInteractive) {
      setLastInteractiveMapId(selectedMapId);
    }
  }, [isInteractive, selectedMapId]);

  // ✅ All useCallback hooks
  const clearProgressiveTimers = useCallback(() => {
    progressiveTimersRef.current.forEach(clearTimeout);
    progressiveTimersRef.current = [];
  }, []);

  const handleMapLoad = useCallback(() => {
    setIsMapLoaded(true);
  }, []);

  const handleMapError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = FALLBACK_IMAGES.MAP;
    setIsMapLoaded(true);
  }, []);

  const handleFullscreenChange = useCallback(() => {
    if (typeof document !== 'undefined') {
      setIsFullscreen(!!document.fullscreenElement);
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (typeof document !== 'undefined') {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch {}
    }
  }, []);

  const toggleOverlays = useCallback(() => setShowOverlays(prev => !prev), []);

  // PROGRESSIVE MOUNTING: Main progressive mounting effect
  useEffect(() => {
    // Reset progressive state when map changes or becomes non-interactive
    if (!isInteractive) {
      clearProgressiveTimers();
      setVisibleOverlayIds(new Set());
      setShowMainSite(false);
      setShowLandmarks(false);
      return;
    }

    // Start progressive mounting when interactive
    if (isInteractive && showOverlays) {
      clearProgressiveTimers(); // Clear any existing timers
      
      // Get all overlay IDs except landmarks
      const regularOverlayIds = activeMapFilterIds.filter(id => 
        id in overlayComponents && selectedMapId !== "hyd" && id !== "map-filter-landmarks"
      );
      
      // Check if landmarks should be shown
      const hasLandmarks = activeMapFilterIds.includes("map-filter-landmarks");

      let currentDelay = 1000; // Start with initial delay to prevent mounting rush

      // Mount regular overlays progressively
      regularOverlayIds.forEach((overlayId, index) => {
        const timer = setTimeout(() => {
          setVisibleOverlayIds(prev => new Set([...prev, overlayId]));
        }, currentDelay);
        
        progressiveTimersRef.current.push(timer);
        currentDelay += 550; // 550ms delay between each overlay
      });

      // Mount landmarks after regular overlays
      if (hasLandmarks) {
        const landmarksTimer = setTimeout(() => {
          setShowLandmarks(true);
        }, currentDelay);
        
        progressiveTimersRef.current.push(landmarksTimer);
        currentDelay += 300; // Extra delay for landmarks to complete their stagger
      }

      // Show main site last
      const mainSiteTimer = setTimeout(() => {
        setShowMainSite(true);
      }, currentDelay);
      
      progressiveTimersRef.current.push(mainSiteTimer);
    }

    // Cleanup on unmount or when dependencies change
    return clearProgressiveTimers;
  }, [isInteractive, showOverlays, activeMapFilterIds, selectedMapId, clearProgressiveTimers]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.addEventListener("fullscreenchange", handleFullscreenChange, { passive: true });
      return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }
  }, [handleFullscreenChange]);

  useEffect(() => {
    if (!showOverlays && selectedLandmarkId) setLandmarkId(null);
  }, [showOverlays, selectedLandmarkId, setLandmarkId]);

  // Route tracing SVG content
  const routeTracingSvgContent = useMemo(() => {
    if (!shouldShowRoutes || currentHighways.length === 0) return null;

    return (
      <svg
        className="absolute inset-0 size-full z-20 pointer-events-none"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1920 1080"
        fill="none"
        aria-hidden="true"
      >
        <AnimatePresence mode="wait">
          {currentHighways.map((highway) => (
            <AnimatedPath
              key={highway.id}
              highway={highway}
              onComplete={handleRouteComplete}
              shouldFadeOut={shouldFadeRoutes}
            />
          ))}
        </AnimatePresence>
      </svg>
    );
  }, [shouldShowRoutes, currentHighways, handleRouteComplete, shouldFadeRoutes]);

  // PROGRESSIVE MOUNTING: Updated normal map SVG content
  const normalSvgContent = useMemo(() => (
    <svg
      className="absolute inset-0 size-full z-10 pointer-events-none"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1920 1080"
      fill="none"
      aria-hidden={!isInteractive}
    >
      {isInteractive && (
        <AnimatePresence>
          {/* Regular Overlays - Only show if progressively mounted */}
          {showOverlays &&
            activeMapFilterIds.map((filterId, index) => {
              // Skip landmarks - they're handled separately
              if (filterId === "map-filter-landmarks") return null;
              
              // Only render if this overlay is in the visible set
              if (!visibleOverlayIds.has(filterId)) return null;
              
              if (filterId in overlayComponents && selectedMapId !== "hyd") {
                const Component = overlayComponents[filterId as keyof typeof overlayComponents];
                return (
                  <motion.g
                    key={filterId}
                    className="pointer-events-auto"
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    transition={{ 
                      duration: 0.5,
                      type: "spring",
                      stiffness: 200,
                      damping: 60,
                      ease: "easeOut"
                    }}
                    style={{ zIndex: 10 }}
                  >
                    <Component className="z-10" />
                  </motion.g>
                );
              }
              return null;
            })}

          {/* Landmarks - Only show if progressively mounted */}
          {showOverlays && 
           showLandmarks && 
           activeMapFilterIds.includes("map-filter-landmarks") && (() => {
              const landmarkFilter = mapFilters.find(f => f.id === "map-filter-landmarks");
              if (landmarkFilter) {
                return (
                  <motion.g
                    key="landmarks"
                    className="pointer-events-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 0.4,
                      staggerChildren: 0.05 // Tighter stagger for smoother animation
                    }}
                    style={{ zIndex: 30 }}
                  >
                    {React.Children.map(landmarkFilter.landmarks, (child, childIndex) => (
                      <motion.g
                        key={childIndex}
                        initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{
                          delay: childIndex * 0.05, // Reduced delay for smoother progression
                          duration: 0.6,
                          type: "spring",
                          stiffness: 250,
                          damping: 35,
                          ease: "easeOut"
                        }}
                      >
                        {child}
                      </motion.g>
                    ))}
                  </motion.g>
                );
              }
              return null;
            })()}

          {/* Main Site - Only show if progressively mounted */}
          {/* {showMainSite && ( */}
            <motion.g
              key="main-site"
              initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 3 }}
              transition={{ 
                duration: 0.8,
                type: "spring",
                stiffness: 220,
                damping: 35,
                ease: "easeOut"
              }}
              className="project-main-site"
              style={{ zIndex: 100 }}
            >
              <motion.g
                className="hover:[&_#project]:fill-green-400/30 hover:[&_#project]:stroke-green-500/70"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <ProjectMainSite />
              </motion.g>
            </motion.g>
          {/* )} */}
        </AnimatePresence>
      )}
    </svg>
  ), [
    showOverlays, 
    activeMapFilterIds, 
    isInteractive, 
    mapFilters, 
    selectedMapId,
    visibleOverlayIds,
    showMainSite,
    showLandmarks
  ]);

  const controlButtons = useMemo(() => (
    <div className="flex gap-2">
      <ControlButton
        onClick={toggleOverlays}
        ariaLabel={showOverlays ? "Hide overlays" : "Show overlays"}
        icon={<RiMap2Line className="text-white group-hover:text-black" />}
        text={showOverlays ? "Hide Overlays" : "Show Overlays"}
      />
      <ControlButton
        onClick={toggleFullscreen}
        ariaLabel={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        icon={
          isFullscreen ? (
            <RiFullscreenExitFill className="text-white group-hover:text-black" />
          ) : (
            <RiFullscreenFill className="text-white group-hover:text-black" />
          )
        }
        text={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      />
    </div>
  ), [toggleOverlays, toggleFullscreen, showOverlays, isFullscreen]);

  if (!isMounted) return null;

  return (
    <>
      {/* Video Intro */}
      {/* {showIntroVideo && (
        <IntroVideo
          onFinish={handleVideoComplete}
          src="./IntroVideo.mp4"
        />
      )} */}

      {/* Map Content */}
      {/* {hasVideoCompleted && ( */}
        <motion.div
          className="relative w-full h-full bg-gradient-to-br from-gray-50/50 via-gray-100/50 to-gray-200/50"
          variants={variants.main}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
        >
          {/* Top Controls */}
          <div className="px-4 pt-4 z-40 absolute top-0 right-0">
            <MapSwitcher variant="pills" />
          </div>
          {/* Top Controls */}
          <div className="px-4 pt-4 z-40 absolute top-16 right-0">
            <MapSwitcherVariants selectedMapIds={selectedMapIds} setSelectedMapIds={setSelectedMapIds}  />
          </div>
          
          {/* Brand Logo */}
          {/* <div className="w-48 h-16 flex p2 z-30 absolute top-4 left-4 border-1 border-black/20 rounded-xl bg-white/20 backdrop-blur-sm shadow-md">
            <Image
              src="/logo.png"
              alt="Brand Logo"
              width={200}
              height={80}
              className="shadow-lg bg-b/70 backdrop-blur-sm p-1 rounded-xl"
              priority
              quality={90}
              loading="eager"
              sizes="150px"
            />
          </div> */}

          {/* Base Map */}
          <div className="absolute inset-0">
            <Image
              src={selectedMapIds ? selectedMap.imagePath : (selectedMap.sattelliteImagePath || selectedMap.imagePath)}
              alt={selectedMap.name}
              fill
              priority
              quality={85}
              loading="eager"
              fetchPriority="high"
              placeholder="blur"
              blurDataURL={generateBlurPlaceholder('#e5e7eb')}
              sizes="100vw"
              className={`object-cover brightness-[0.98] contrast-[1.02] transition-opacity duration-300 ${
                isMapLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleMapLoad}
              onError={handleMapError}
              unoptimized={isCurrentMapPreloaded}
            />
          </div>

          {/* Route Tracing Animation */}
          {routeTracingSvgContent}

          {/* Normal Map Content */}
          {normalSvgContent}

          {/* Map Filter Panel */}
          <AnimatePresence>
            {showOverlays && isMapLoaded && isInteractive  && (
              <motion.div
                className="absolute bottom-6 left-4 z-20"
                variants={variants.panel}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                <CollapsiblePanel
                  title="Map Filters"
                  className="bg-black/90 backdrop-blur-sm shadow-lg"
                >
                  <Suspense fallback={<Placeholders.MapFilter />}>
                    <MapFilterComponent />
                  </Suspense>
                </CollapsiblePanel>
                  <div className="flex items-center justify-center bg-black/90 pb-2 rounded-bl-[10px] rounded-br-[10px] shadow-sm">
                    <motion.div className="flex justify-center bg-white p-2 h-16 mt-2 rounded-lg shadow-lg">
                      <img src="/logo.png" alt="logo" width={130} />
                    </motion.div>
                  </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* compass */}
          <Compass/>

          {/* Control Buttons */}
          {isInteractive && (
            <motion.div
              className="absolute bottom-4 right-4 z-20 flex flex-col gap-2 p-1.5 bg-black/80 backdrop-blur-sm rounded-lg shadow-sm"
              variants={variants.controls}
              initial="hidden"
              animate="visible"
            >
              {controlButtons}
            </motion.div>
          )}
        </motion.div>
      {/* )} */}
    </>
  );
};

export default React.memo(MapView);