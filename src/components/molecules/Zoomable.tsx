"use client";
import React, { useState, useCallback } from "react";
import { MapInteractionCSS } from "react-map-interaction";
import type { MapInteractionValue } from "react-map-interaction";

interface ZoomableProps {
  children: React.ReactNode;
}

const Zoomable: React.FC<ZoomableProps> = ({ children }) => {
  const [mapValue, setMapValue] = useState<MapInteractionValue>({
    scale: 1,
    translation: { x: 0, y: 0 },
  });

  const handleChange = useCallback((value: MapInteractionValue) => {
    const factor = value.scale - 1;
    const maxX = -window.innerWidth * factor;
    const maxY = -window.innerHeight * factor;

    const x = Math.min(0, Math.max(value.translation.x, maxX));
    const y = Math.min(0, Math.max(value.translation.y, maxY));

    setMapValue({
      scale: value.scale,
      translation: { x, y },
    });
  }, []);

  return (
    <MapInteractionCSS
      minScale={1}
      maxScale={6}
      value={mapValue}
      onChange={handleChange}
      showControls
      controlsClassName="absolute top-10 right-10 z-50"
      btnClassName="bg-gray-800 text-white p-2 rounded"
      className="cursor-pointer w-full h-full"
    >
      {children}
    </MapInteractionCSS>
  );
};

export default Zoomable;