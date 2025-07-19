"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface AnimatedPathProps {
  path: string;
  duration: number;
  strokeColor: string;
  className?: string;
}

const AnimatedPath: React.FC<AnimatedPathProps> = ({
  path,
  duration,
  strokeColor,
  className = "",
}) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const pathElement = pathRef.current;
    if (!pathElement) return;

    try {
      const length = pathElement.getTotalLength();

      pathElement.style.transition = "none";
      pathElement.style.strokeDasharray = `${length} ${length}`;
      pathElement.style.strokeDashoffset = `${length}`;
      pathElement.getBoundingClientRect();
      pathElement.style.transition = `stroke-dashoffset ${duration}ms ease-in-out`;
      pathElement.style.strokeDashoffset = "0";
    } catch {}
  }, [duration, path]);

  if (!path) {
    return null;
  }

  return (
    <motion.g
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`pointer-events-none ${strokeColor} ${className}`}
      role="presentation"
      aria-hidden="true"
    >
      <path
        ref={pathRef}
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.g>
  );
};

export default AnimatedPath;
