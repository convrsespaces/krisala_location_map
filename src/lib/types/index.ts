import { SVGAttributes } from 'react';

export interface UserType {
  id: string;
  email: string;
  [key: string]: string | number | boolean | object | null | undefined;
}

export interface Inventory {
  unit_id: string;
  [key: string]: string | number | boolean | object | null | undefined;
}

export interface BookingDetails {
  details: Record<
    string,
    string | number | boolean | object | null | undefined
  >;
}

export interface LoginResponse {
  jwt: string;
  user: UserType;
}

export interface User {
  id: string;
  email: string;
  [key: string]: string | number | boolean | object | null | undefined;
}

export interface InventoryType {
  id: string;
  unit_id: string;
  tower: string;
  floor: string;
  unit_number: number;
  unit_type: string;
  area: number;
  TotalCost: number;
  status: string;
  [key: string]: string | number | boolean | object | null | undefined;
}

export interface BookingDetailsType {
  [key: string]: string | number | boolean | object | null | undefined;
}

export interface LoginResponseType {
  jwt: string;
  user: UserType;
}

export interface MapFilter {
  id: string;
  title: string;
  className: string;
  iconKey: string;
  icon: React.ReactNode;
  landmarks: React.ReactElement;
}

export interface TransformedMarker {
  id: string;
  iconKey: string;
  route?: string;
  routeDetails?: {
    icon?: {
      type: string;
      attributes: SVGAttributes<SVGElement>;
    };
    landmark_name?: string;
    details?: string;
    distance?: string;
    time?: string;
    img?: string;
  };
}

export interface Marker {
  id: string;
  cx: number;
  cy: number;
}

export interface MarkerSvgProps {
  circle?: {
    id: string;
    cx: number;
    cy: number;
    r: number;
    fill: string;
  };
  paths?: Array<{
    id: string;
    d: string;
    fill: string;
  }>;
}

export interface HotelMarker extends Marker, MarkerSvgProps {
  type: "hotel";
}

export interface HospitalMarker extends Marker, MarkerSvgProps {
  type: "hospital";
}

export interface MallMarker extends Marker, MarkerSvgProps {
  type: "mall";
}

export interface SchoolMarker extends Marker, MarkerSvgProps {
  type: "school";
}

export interface TempleMarker extends Marker, MarkerSvgProps {
  type: "temple";
}

export interface MetroMarker extends Marker, MarkerSvgProps {
  type: "metro";
}

export interface RecreationMarker extends Marker, MarkerSvgProps {
  type: "recreation";
}
export interface EntertainmentMarker extends Marker, MarkerSvgProps {
  type: "entertainment";
}

export interface LandmarkDetailsCardProps {
  routeDetails: {
    icon?: {
      type: string;
      attributes: SVGAttributes<SVGElement>;
    };
    distance?: string;
    time?: string;
    landmark_name?: string;
    details?: string;
    img?: string;
  };
}
