// components/Compass.tsx
import React from 'react';
import styles from '../../styles/compass.module.css';

interface CompassProps {
  angle?: number;
}

const Compass: React.FC<CompassProps> = ({ angle = 0 }) => {
  return (
    <div
      className={`
        z-10 absolute flex flex-row items-center justify-center 
        transition-all duration-200 ease-linear origin-center 
        rounded-full bg-[rgba(132,131,131,0.7)] backdrop-blur-[2px] 
        animate-pulse-scale overlay-can-hide compasss

        // Base/Mobile styles
        w-[3.2rem] h-[3.2rem] right-2 bottom-[16%] 

        // Small screens (matches your 481px-768px media query)
        sm:w-[3rem] sm:h-[3rem] sm:right-3 sm:bottom-[21%] 
        
        // Medium screens (matches your 768px-1023px media query)
        md:w-[3.5rem] md:h-[3.5rem] md:right-4 md:bottom-[20%] 

        // Large screens (matches your 1024px+ media query)
        lg:w-[4.5rem] lg:h-[4.5rem] lg:right-4 lg:bottom-[12%]
      `}
      style={{ transform: `rotate(${angle}deg)` }}
    >
      <div className="flex flex-col relative"> {/* compass__wrapper */}
        <div className="flex flex-col justify-center items-center"> {/* compass__circle */}
          <div
            className="text-[8px] leading-none font-normal text-white text-center absolute transition-all duration-200 ease-linear
              // Base/Mobile top position
              -top-[10px] 
              // Small screens (sm)
              sm:-top-[10px] 
              // Medium screens (md)
              md:-top-[11px] 
              // Large screens (lg)
              lg:-top-[13px]
            "
          >
            N
          </div>
          <div className={`
            flex flex-col items-center justify-center relative 
            rounded-full bg-[rgba(35,35,35,0.5)] transition-all duration-200 ease-linear
            w-[1.8rem] h-[1.8rem]
            sm:w-[2rem] sm:h-[2rem]
            md:w-[2rem] md:h-[2rem]            
            lg:w-[2.5rem] lg:h-[2.5rem]

            ${styles.compassArrow}
          `}></div>
        </div>
      </div>
    </div>
  );
};

export default Compass;