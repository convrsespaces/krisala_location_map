"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useOptimizedMapFilter } from "@/lib/hooks/useOptimizedMapFilter";
import { createMapFilters } from "@/lib/constants/mapFilters";
import { useMap } from "@/lib/hooks/useMap";
import { useAppSelector } from "@/lib/store/hooks";
import { FilterConfig } from "@/lib/store/slices/filterSlice";
import { HotelIcon } from "@/components/icons/HotelIcon";
import { HospitalIcon } from "@/components/icons/HospitalIcon";
import { MetroIcon } from "@/components/icons/MetroIcon";
import { RecreationIcon } from "../icons/RecreationIcon";
import { SchoolIcon } from "@/components/icons/SchoolIcon";
import { MallsIcon } from "@/components/icons/MallsIcon";
import { LandmarkIcon } from "@/components/icons/LandMarkIcon";
import { Button } from "@/components/ui/button";
import TempleIcon from "../icons/TempleIcon";
import { EntertainmentIcon } from "../icons/EntertainmentIcon";

interface MapFilterType {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

const ControlButton = React.memo(
  ({
    onClick,
    disabled = false,
    className = "",
    ariaLabel,
    children,
  }: {
    onClick: () => void;
    disabled?: boolean;
    className?: string;
    ariaLabel: string;
    children: React.ReactNode;
  }) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        onClick={onClick}
        disabled={disabled}
        aria-label={ariaLabel}
        className={`flex-1 w-16 px-2.5 py-1.5 h-7 text-sm font-medium whitespace-pre rounded-md shadow-sm bg-white/20 hover:bg-white/80 cursor-pointer ${
          disabled ? "opacity-80" : ""
        } ${className}`}
      >
        {children}
      </Button>
    </motion.div>
  )
);

ControlButton.displayName = "ControlButton";

const FilterButton = React.memo(
  ({
    filter,
    isActive,
    onClick,
  }: {
    filter: MapFilterType;
    isActive: boolean;
    onClick: () => void;
  }) => (
    <motion.div
      key={filter.id}
      variants={itemVariants}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        onClick={onClick}
        aria-pressed={isActive}
        variant="default"
        className={`flex items-center justify-start gap-2 px-5 h-9 w-[98%] mx-auto my-1 text-base shadow-2xl cursor-pointer ${
          isActive
            ? "bg-[white]/5 text-white hover:bg-[black]/50 border border-[white]"
            : "text-text-white bg-white/20 hover:bg-white/30 hover:text-gray-300"
        }`}
      >
        <div className={`w-5 h-5 ${
          isActive ? "text-gray-700" : "text-gray-500"
        }`}>
          {filter.icon}
        </div>
        <span className="text-xs font-medium">{filter.title}</span>
      </Button>
    </motion.div>
  )
);

FilterButton.displayName = "FilterButton";

const MapFilter: React.FC = () => {
  const { currentMapId } = useMap();
  const selectedMapId = useAppSelector((state) => state.map.selectedMapId);
  const filterConfigs = useAppSelector((state) => state.filter.filterConfigs);
  const filterLoading = useAppSelector((state) => state.filter.loading);
  const filterError = useAppSelector((state) => state.filter.error);

  const mapFilters = useMemo(() => {
    if (filterConfigs.length > 0) {
      return filterConfigs.map((config: FilterConfig) => {
        let IconComponent;
        switch (config.id) {
          case "map-filter-hotels":
            IconComponent = HotelIcon;
            break;
          case "map-filter-hospitals":
            IconComponent = HospitalIcon;
            break;
          case "map-filter-recreations":
            IconComponent = RecreationIcon;
            break;
          case "map-filter-entertainments":
            IconComponent = EntertainmentIcon;
            break;
          case "map-filter-metros":
            IconComponent = MetroIcon;
            break;
          case "map-filter-schools":
            IconComponent = SchoolIcon;
            break;
          case "map-filter-malls":
            IconComponent = MallsIcon;
            break;
          case "map-filter-landmarks":
            IconComponent = LandmarkIcon;
            break;
          case "map-filter-temples":
            IconComponent = TempleIcon;
            break;
          default:
            IconComponent = HotelIcon;
        }

        return {
          id: config.id,
          title: config.title,
          icon: <IconComponent className="w-8 h-8" />,
        };
      });
    }

    return createMapFilters(selectedMapId);
  }, [filterConfigs, selectedMapId, filterLoading, filterError]);
  const {
    activeMapFilterIds,
    allActive,
    noneActive,
    isFilterActive,
    toggleFilter,
    // showAllFilters,
    // hideAllFilters,
    toggleFilters,
    loading,
    error,
  } = useOptimizedMapFilter();

  const filterButtons = useMemo(
    () =>
      mapFilters.map((filter) => (
        <FilterButton
          key={filter.id}
          filter={{
            id: filter.id,
            title: filter.title,
            icon: filter.icon,
          }}
          isActive={isFilterActive(filter.id)}
          onClick={() => toggleFilter(filter.id)}
        />
      )),
    [mapFilters, isFilterActive, toggleFilter]
  );

  const controlButtons = useMemo(
    () => (
      <div className="">
        <ControlButton
          onClick={toggleFilters}
          // disabled={allActive}
          ariaLabel="Show all filters"
          className="bg-white/20 hover:bg-white/30 hover:text-white text-white/80 w-full border border-white/50"
        >
          {allActive ? 'Hide All' : 'Show All'}
        </ControlButton>
        {/* <ControlButton
          onClick={hideAllFilters}
          disabled={noneActive}
          ariaLabel="Hide all filters"
          className="text-white bg-white/20 hover:bg-white/80 hover:text-black"
        >
          Hide
        </ControlButton> */}
      </div>
    ),
    [toggleFilters, allActive, noneActive]
  );

  return (
    <motion.div
      className="flex flex-col gap-2 max-h-[80vh] max-w-[280px]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      layout="position"
    >
      <motion.div
        className="flex flex-col gap-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent"
        variants={containerVariants}
        layout="position"
      >
        <AnimatePresence initial={false} mode="sync">
          {filterButtons}
        </AnimatePresence>
      </motion.div>
       {controlButtons}
    
    </motion.div>
  );
};

export default React.memo(MapFilter);
