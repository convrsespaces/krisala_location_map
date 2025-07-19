declare module "react-map-interaction" {
    import { ReactNode } from "react";
  
    export interface MapInteractionValue {
      scale: number;
      translation: { x: number; y: number };
    }
  
    export interface MapInteractionCSSProps {
      children: ReactNode;
      minScale?: number;
      maxScale?: number;
      value?: MapInteractionValue;
      onChange?: (value: MapInteractionValue) => void;
      showControls?: boolean;
      controlsClassName?: string;
      btnClassName?: string;
      plusBtnClassName?: string;
      minusBtnClassName?: string;
      className?: string;
    }
  
    export const MapInteractionCSS: React.FC<MapInteractionCSSProps>;
  }