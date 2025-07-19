import React from "react";

interface IconProps {
  className?: string;
}

export const MallsIcon: React.FC<IconProps> = ({ className }) => (
  <svg width="38" height="38" viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
  <g id="MallIcon">
    <g id="Ellipse 4" filter="url(#filter0_d_116_559)">
    <circle cx="31.5349" cy="27.5349" r="27.5349" fill="white"/>
    </g>
    <path id="Vector" d="M16.8262 41.1882H46.6142V43.05H16.8262V41.1882Z" fill="#001E72"/>
    <path id="Vector_2" d="M16.8262 13.262V24.4325C16.8355 25.7953 17.5727 26.9831 18.6712 27.6254L18.6879 39.3265H35.4437V30.0177H41.029V39.3265H44.7525V27.6347C45.8677 26.9831 46.6049 25.7953 46.6142 24.4343V13.262L16.8262 13.262ZM24.2732 16.9855H27.9967V24.4325C27.9967 25.4602 27.1626 26.2942 26.1349 26.2942C25.1072 26.2942 24.2732 25.4602 24.2732 24.4325V16.9855ZM20.5497 26.2942C19.522 26.2942 18.6879 25.4602 18.6879 24.4325V16.9855H22.4114V24.4325C22.4114 25.4602 21.5774 26.2942 20.5497 26.2942ZM31.7202 35.603H22.4114V30.0177H31.7202V35.603ZM33.5819 24.4325C33.5819 25.4602 32.7479 26.2942 31.7202 26.2942C30.6925 26.2942 29.8584 25.4602 29.8584 24.4325V16.9855H33.5819V24.4325ZM39.1672 24.4325C39.1672 25.4602 38.3331 26.2942 37.3055 26.2942C36.2778 26.2942 35.4437 25.4602 35.4437 24.4325V16.9855H39.1672V24.4325ZM44.7525 24.4325C44.7525 25.4602 43.9184 26.2942 42.8907 26.2942C41.863 26.2942 41.029 25.4602 41.029 24.4325V16.9855H44.7525V24.4325Z" fill="#001E72"/>
    </g>
    <defs>
    <filter id="filter0_d_116_559" x="0.760601" y="0" width="61.5491" height="61.5486" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="3.2394"/>
    <feGaussianBlur stdDeviation="1.6197"/>
    <feComposite in2="hardAlpha" operator="out"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_116_559"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_116_559" result="shape"/>
    </filter>
    </defs>
  </svg>
);
