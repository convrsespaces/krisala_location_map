"use client";

import React, { useEffect, useMemo } from 'react';
import { motion, useAnimation, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

interface MapLoadingScreenProps {
  progress: number;
  message: string;
  onAnimationComplete?: () => void;
  mapImage?: string; // low-quality map image path
}

const GRID_ROWS = 6;
const GRID_COLS = 8;

const MapLoadingScreen: React.FC<MapLoadingScreenProps> = ({
  progress,
  message,
  onAnimationComplete,
  mapImage
}) => {
  const controls = useAnimation();
  const prefersReducedMotion = useReducedMotion();
  
  // Memoize animation variants to prevent unnecessary re-renders
  const variants = useMemo(() => ({
    container: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      exit: { opacity: 0 }
    },
    tile: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: (i: number) => ({
        opacity: 1,
        scale: 1,
        transition: {
          delay: 0.1 + (i * 0.04),
          duration: 0.4,
          ease: 'easeOut',
        },
      }),
    },
    circle: {
      animate: {
        scale: prefersReducedMotion ? 1 : [1, 1.1, 1],
        opacity: prefersReducedMotion ? 1 : [0.5, 1, 0.5],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    },
    progress: {
      animate: {
        clipPath: `polygon(0 0, ${progress}% 0, ${progress}% 100%, 0 100%)`,
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      }
    },
    content: {
      hidden: { y: 20, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    },
    button: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
      hover: { scale: 1.05 },
      tap: { scale: 0.95 }
    }
  }), [progress, prefersReducedMotion]);

  useEffect(() => {
    controls.start(variants.circle.animate);
  }, [controls, variants.circle.animate]);

  // Generate grid tiles for animation
  const tiles = useMemo(() => {
    const arr = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        arr.push({ row, col, i: row * GRID_COLS + col });
      }
    }
    return arr;
  }, []);

  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/90 backdrop-blur-sm"
      variants={variants.container}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.3 }}
    >
      {/* Blurred map background */}
      {mapImage && (
        <div className="absolute inset-0 w-full h-full -z-10">
          <Image
            src={mapImage}
            alt="Loading map background"
            fill
            style={{ objectFit: 'cover', filter: 'blur(16px) brightness(0.7)' }}
            priority
            unoptimized
          />
        </div>
      )}
      {/* Animated grid overlay */}
      <div className="absolute inset-0 w-full h-full grid" style={{ gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`, gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}>
        {tiles.map(({ row, col, i }) => (
          <motion.div
            key={`tile-${row}-${col}`}
            className="bg-white/10 border border-white/10"
            style={{ width: '100%', height: '100%' }}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={variants.tile}
          />
        ))}
      </div>
      <div className="relative w-64 h-64 mb-8">
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-blue-500/30"
          animate={controls}
        />
        <motion.div
          className="absolute inset-0 rounded-full border-4 border-blue-500"
          variants={variants.progress}
          animate="animate"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="w-16 h-16 rounded-full bg-blue-500"
            animate={prefersReducedMotion ? {} : {
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
      
      <motion.div
        className="text-center"
        variants={variants.content}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-semibold text-white mb-2">{message}</h3>
        <p className="text-blue-200">{Math.round(progress)}%</p>
      </motion.div>
      
      {progress >= 100 && onAnimationComplete && (
        <motion.div
          className="mt-8"
          variants={variants.button}
          initial="hidden"
          animate="visible"
          onAnimationComplete={onAnimationComplete}
        >
          <motion.button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            whileHover={prefersReducedMotion ? {} : "hover"}
            whileTap={prefersReducedMotion ? {} : "tap"}
          >
            Continue
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MapLoadingScreen;