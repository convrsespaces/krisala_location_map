import React, { useState, useRef, useEffect } from "react";
import { MapConfig, mapsConfig } from "../config/maps";
import { Landmark, Route } from "../types";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setSelectedMapId } from "@/lib/store/slices/mapSlice";
import {MapSwitcher} from "./molecules/MapSwitcher";

interface MapProps {
  onLandmarkClick?: (landmark: Landmark) => void;
}

const Map: React.FC<MapProps> = ({ onLandmarkClick }) => {
  const dispatch = useAppDispatch();
  const selectedMapId = useAppSelector((state) => state.map.selectedMapId);
  const selectedMap =
    mapsConfig.find((map) => map.id === selectedMapId) || mapsConfig[0];

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale((prev) => Math.min(Math.max(prev * delta, 0.5), 3));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [selectedMapId]);

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 border-b border-gray-200">
        <MapSwitcher className="p-2" variant="tabs" />
      </div>
      <div
        ref={mapRef}
        className="relative flex-1 overflow-hidden bg-gray-100"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="absolute"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: "0 0",
            transition: isDragging ? "none" : "transform 0.1s",
          }}
        >
          <img
            src={selectedMap.imagePath}
            alt={selectedMap.name}
            className="max-w-none"
            draggable={false}
          />

          <div
            className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{
              left: `${selectedMap.mainSite.x}%`,
              top: `${selectedMap.mainSite.y}%`,
            }}
            title="Main Site"
          />

          {selectedMap.landmarks.map((landmark) => (
            <div
              key={landmark.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{
                left: `${landmark.x}%`,
                top: `${landmark.y}%`,
              }}
              onClick={() => onLandmarkClick?.(landmark)}
              title={landmark.name}
            >
              <span className="text-2xl">{landmark.icon}</span>
            </div>
          ))}

          {selectedMap.routes.map((route) => (
            <svg
              key={route.id}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
            >
              <polyline
                points={route.points
                  .map(
                    (point: { x: number; y: number }) =>
                      `${point.x}%,${point.y}%`
                  )
                  .join(" ")}
                fill="none"
                stroke={route.color}
                strokeWidth="2"
              />
            </svg>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;
