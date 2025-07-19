import React from "react";
import { SVGAttributes, SVGElementType } from "@/lib/store/slices/filterSlice";

/**
 * Converts serializable SVG data to React components
 * @param svgData The serialized SVG data
 * @returns A React component representing the SVG element
 */
export const svgDataToComponent = (
  svgData: SVGAttributes | any
): React.ReactElement => {
  if (typeof svgData === "function") {
    return React.createElement("circle", { cx: 0, cy: 0, r: 0 });
  }

  if (!svgData || typeof svgData !== "object" || !("type" in svgData)) {
    return React.createElement("circle", { cx: 0, cy: 0, r: 0 });
  }

  const type = svgData.type as SVGElementType;
  if (
    !type ||
    typeof type !== "string" ||
    !["path", "circle", "rect"].includes(type)
  ) {
    return React.createElement("circle", { cx: 0, cy: 0, r: 0 });
  }

  switch (type) {
    case "path":
      return React.createElement("path", svgData.attributes);
    case "circle":
      return React.createElement("circle", svgData.attributes);
    case "rect":
      return React.createElement("rect", svgData.attributes);
    default:
      return React.createElement("circle", { cx: 0, cy: 0, r: 0 });
  }
};
