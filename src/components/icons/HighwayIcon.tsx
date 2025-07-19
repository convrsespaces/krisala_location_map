import React from "react";

interface IconProps {
  className?: string;
}

export const HighwayIcon: React.FC<IconProps> = ({ className }) => (
  <svg
    width={32}
    height={32}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className || "highway-icon"}
  >
    <circle cx={16} cy={16} r={15.5} fill="#959595" stroke="#fff" />
    <path
      d="M13.5 23.5v-16.5h-2.5L8 23.674l5.5-.174zm4 0v-16.5l2.5-.023 3.5 16.674-5.5.023z"
      fill="#fff"
      stroke="#fff"
      strokeLinecap="round"
    />
    <path
      d="M11.473 11v3.5m0 3v3.5m9-10v3.5m0 3v3.5"
      stroke="#959595"
      strokeLinecap="round"
    />
  </svg>
);