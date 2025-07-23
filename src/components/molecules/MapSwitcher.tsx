import React from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setSelectedMapId } from "@/lib/store/slices/mapSlice";
import { mapsConfig } from "@/config/maps";
import { motion, AnimatePresence } from "framer-motion";

interface MapSwitcherProps {
  className?: string;
  variant?: "tabs" | "buttons" | "pills";
}
interface MapSwitcherVariantsProps {
  selectedMapIds: boolean;
  setSelectedMapIds: (value: boolean) => void;
}

export const MapSwitcher: React.FC<MapSwitcherProps> = ({
  className = "",
  variant = "tabs",
}) => {
  const dispatch = useAppDispatch();
  const selectedMapId = useAppSelector((state) => state.map.selectedMapId);

  const handleMapChange = (mapId: string) => {
    dispatch(setSelectedMapId(mapId));
  };

  const getButtonStyles = (mapId: string) => {
    const isSelected = selectedMapId === mapId;

    switch (variant) {
      case "tabs":
        return `px-4 py-2.5 rounded-lg font-medium text-sm shadow-sm transition-all duration-200 ${
          isSelected
            ? "bg-white/90 backdrop-blur-sm text-gray-800 shadow-md"
            : "bg-white/60 backdrop-blur-sm text-gray-600 hover:bg-white/80 hover:text-gray-800"
        }`;

      case "pills":
        return `px-4 py-2 rounded-lg font-medium text-sm shadow-sm transition-all duration-200 cursor-pointer ${
          isSelected
            ? "bg-[#C59B60] backdrop-blur-sm text-black shadow-md"
            : "bg-white/70 backdrop-blur-[1px] text-black/70 hover:bg-white/70 hover:text-gray-800"
        }`;

      case "buttons":
      default:
        return `px-4 py-2.5 font-medium text-sm shadow-sm transition-all duration-200 ${
          isSelected
            ? "bg-white/90 backdrop-blur-sm text-gray-800 shadow-md"
            : "bg-white/60 backdrop-blur-sm text-gray-600 hover:bg-white/80 hover:text-gray-800"
        }`;
    }
  };

  return (
    <div
      className={`flex gap-2 p-1.5 bg-[black]/80 backdrop-blur-[8px] rounded-lg shadow-sm ${className}`}
    >
      <AnimatePresence>
        {mapsConfig.map((map) => (
          <motion.button
            key={map.id}
            onClick={() => handleMapChange(map.id)}
            className={`relative ${getButtonStyles(map.id)}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {map.name}
            {selectedMapId === map.id && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-white/20"
                layoutId="mapSwitcherIndicator"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const MapSwitcherVariants: React.FC< MapSwitcherVariantsProps> = ({selectedMapIds,setSelectedMapIds}) => {
  const selectedMapId = useAppSelector((state) => state.map.selectedMapId);
  return(
    <div onClick={()=>setSelectedMapIds(!selectedMapIds)} className="overlay-can-hide rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200 ease-in-out">
      { (selectedMapId == "10km") ?
        <img className="h-20 w-40" src={`/maps/${selectedMapIds ? 'sattellite.webp':'35km.png'}`} alt="sattellite view" />:
        <img className="h-20 w-40" src={`/maps/${selectedMapIds ? 'sattelite10.webp':'10km.png'}`} alt="sattellite view" />
      }
    </div>
  )
}