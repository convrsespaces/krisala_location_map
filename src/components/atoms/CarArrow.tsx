import React, { memo, useMemo } from "react";
import { reverse as reversePath } from "svg-path-reverse";

interface CarArrowProps {
  path: string;
  dur?: number;
  reverse?: boolean;
}

const COLORS = [
  "#ebe8e8e5",
  "#f88383e4",
  "#83e7f8e3",
  "#f8e883e3",
  "#83f883e3",
  "#f883e7e3",
  "#414141e3",
  "#e99343e3",
] as const;

const ARROW_SHAPES = {
  forward: "M-5,-5 L10,0 -5,5 0,0 Z",
  reverse: "M0,0 L5,-5 -10,0 5,5 Z",
} as const;

const getRandomColor = (): string => 
  COLORS[Math.floor(Math.random() * COLORS.length)];

const CarArrow = memo(function CarArrow({ 
  path, 
  dur = 6, 
  reverse = false 
}: CarArrowProps) {
  const pathId = useMemo(() => `path-${Math.random().toString(36).substring(2, 9)}`, []);
  const reversedPath = useMemo(() => reversePath(path), [path]);
  const arrowShape = reverse ? ARROW_SHAPES.reverse : ARROW_SHAPES.forward;
  const rotate = reverse ? "auto-reverse" : "auto";
  const color = useMemo(() => getRandomColor(), []);
  
  return (
    <g style={{ pointerEvents: "none" }}>
      <defs>
        <path 
          id={pathId} 
          d={reverse ? reversedPath : path} 
          fill="none" 
        />
      </defs>
      <path
        d={arrowShape}
        fill={color}
        stroke="white"
        strokeWidth="0.8"
      >
        <animateMotion
          dur={`${dur}s`}
          repeatCount="indefinite"
          rotate={rotate}
        >
          <mpath href={`#${pathId}`} />
        </animateMotion>
      </path>
    </g>
  );
});

CarArrow.displayName = "CarArrow";

export default CarArrow;