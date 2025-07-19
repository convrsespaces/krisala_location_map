"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaSearchPlus, FaSearchMinus } from "react-icons/fa";
import { FALLBACK_IMAGES } from "@/lib/constants/images";
import { handleImageError, getImageSrc } from "@/lib/utils/imageUtils";

interface SimpleZoomableImageProps {
  src: string;
  alt: string;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

const SimpleZoomableImage: React.FC<SimpleZoomableImageProps> = ({
  src,
  alt,
  fallbackSrc = FALLBACK_IMAGES.FLAT,
  onLoad,
  onError,
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentSrc, setCurrentSrc] = useState(getImageSrc(src, fallbackSrc));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  const handleImageError = () => {
    setCurrentSrc(fallbackSrc);
    onError?.();
  };

  const handleZoomIn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setScale((prev) => Math.max(prev - 0.5, 1));
  };

  const handleReset = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    } else {
      setScale(2);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      e.preventDefault();
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Calculate boundaries
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const containerHeight = containerRef.current?.offsetHeight || 0;
      const maxX = (containerWidth * (scale - 1)) / 2;
      const maxY = (containerHeight * (scale - 1)) / 2;
      
      // Constrain movement within boundaries
      const boundedX = Math.max(-maxX, Math.min(maxX, newX));
      const boundedY = Math.max(-maxY, Math.min(maxY, newY));
      
      setPosition({ x: boundedX, y: boundedY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };
  
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.deltaY < 0) {
      setScale((prev) => Math.min(prev + 0.1, 3));
    } else {
      setScale((prev) => Math.max(prev - 0.1, 1));
    }
  };

  return (
    <div className="relative w-full h-full">
      <div 
        ref={containerRef}
        className={`w-full h-full overflow-hidden ${scale > 1 ? 'cursor-move' : 'cursor-zoom-in'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
      >
        <div
          className="w-full h-full transition-transform duration-200"
          style={{ 
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)` 
          }}
        >
          <Image
            src={currentSrc}
            alt={alt}
            fill
            className="object-contain"
            onLoad={onLoad}
            onError={handleImageError}
            priority
            draggable={false}
          />
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-4 right-4 flex space-x-2 z-10">
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={scale <= 1}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
          aria-label="Zoom out"
        >
          <FaSearchMinus />
        </button>
        <button
          type="button"
          onClick={handleZoomIn}
          disabled={scale >= 3}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70"
          aria-label="Zoom in"
        >
          <FaSearchPlus />
        </button>
      </div>

      {/* Zoom level indicator */}
      <div className="absolute top-4 left-4 bg-black/50 text-white px-2 py-1 rounded z-10">
        {Math.round(scale * 100)}%
      </div>

      {/* Reset button */}
      {scale > 1 && (
        <button
          type="button"
          onClick={handleReset}
          className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 z-10"
          aria-label="Reset zoom"
        >
          Reset
        </button>
      )}
    </div>
  );
};

export default SimpleZoomableImage;