"use client";

import React, { forwardRef } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  offset?: number;
}

const CustomTooltip = forwardRef<SVGGElement, TooltipProps>(
  ({ children, content, placement = "top", offset = 10 }, ref) => {
    // Convert placement to side for Shadcn Tooltip
    const side = placement as "top" | "bottom" | "left" | "right";

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <g
              ref={ref}
              style={{ pointerEvents: "auto" }}
            >
              {children}
            </g>
          </TooltipTrigger>
          <TooltipContent side={side} sideOffset={offset}>
            {content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

CustomTooltip.displayName = "CustomTooltip";

export default CustomTooltip;
