export interface Point {
  x: number;
  y: number;
}

export interface Landmark {
  id: string;
  name: string;
  x: number;
  y: number;
  icon: string;
  description: string;
}

export interface Route {
  id: string;
  name: string;
  points: Point[];
  color: string;
}

export interface LandmarkIconData {
  id: string;
  label: string;
  timeDistance: string;
  textPath: string;
  textPathFill: string;
  vectorPath?: string;
  iconPath: string;
  iconPathFill: string;
  // Image properties for embedding photos/images in SVG icons
  imageSrc?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageX?: number;
  imageY?: number;
  // For dynamic circular image clipping
  clipCenterX?: number;
  clipCenterY?: number;
  clipRadius?: number;
  // SVG defs content for patterns, images, clipPaths, etc.
  defs?: string;
  // Pattern fill reference for using embedded patterns
  patternFill?: string;
  paths?: {
    d: string;
    fill?: string;
    patternFill?: string;
    id?: string;
  }[];
}