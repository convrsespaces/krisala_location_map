"use client";

import React from "react";
import {  markerStyles } from "@/lib/data/markerConfig";
import CustomTooltip from "./CustomTooltip";
import { useLandmark } from "@/lib/hooks/useLandmark";
import { TransformedMarker } from "@/lib/hooks/useFilterConfigs";

interface MapMarkerProps {
  id: string;
  marker: TransformedMarker;
  className?: string;
}

interface LegacyMapMarkerProps {
  id: string;
  cx: number;
  cy: number;
  type: string;
  index: number;
  onClick?: () => void;
}

const MapMarker: React.FC<MapMarkerProps | LegacyMapMarkerProps> = (props) => {
  const { setLandmarkId } = useLandmark();
  
  if ('marker' in props) {
    const { marker, id } = props;
    
    if (marker.icon && React.isValidElement(marker.icon)) {
      return (
        <g 
          className={props.className} 
          filter="url(#filter0_ii_all)"
          onClick={(e) => {
            e.stopPropagation();
            setLandmarkId(marker.id);
          }}
          style={{ 
            cursor: 'pointer',
            pointerEvents: 'all'
          }}
        >
          {marker.icon}
        </g>
      );
    }
    return null;
  }
  
  const { id, cx, cy, type, index, onClick } = props as LegacyMapMarkerProps;
  const style = markerStyles[type] || markerStyles.hotel;
  const baseX = cx + (style.baseXOffset || 0);
  const baseY = cy + (style.baseYOffset || 0);

  return (
    <CustomTooltip content={id} placement="top" offset={12}>
      <g 
        id={`__${type}_${id}_d_${index}`} 
        onClick={onClick}
        style={{ 
          cursor: onClick ? "pointer" : "default",
          transform: `translate(${cx}, ${cy})`,
          transformOrigin: 'center'
        }}
      >
        <circle
          cx={0}
          cy={0}
          r={style.radius || 22.5}
          fill={style.fill}
        />
        <path 
          d={style.iconPath} 
          fill="white" 
          // transform={`translate(${baseX - cx}, ${baseY - cy})`} 
        />
      </g>
    </CustomTooltip>
  );
};

export default MapMarker;