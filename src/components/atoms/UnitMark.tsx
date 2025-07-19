import React from "react";
import { LocationIcon } from "../icons/LocationIcon";

interface UnitDetails {
  unit_number: string;
  unit_type: string;
  area?: number;
  status?: string;
  TotalCost?: number;
}

interface UnitMarkProps {
  left?: string;
  top?: string;
  isSelected: boolean;
  unit: string;
  onExploreClick?: () => void;
  selectedUnit: UnitDetails;
  isActive: boolean;
  "data-is-below"?: boolean;
}

const UnitMark: React.FC<UnitMarkProps> = ({
  left = "0",
  top = "auto",
  isSelected,
  onExploreClick,
  selectedUnit,
  isActive,
  ...props
}) => {
  if (!isActive) return null;

  // Function to format currency
  const formatCurrency = (amount?: number) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Function to get status color
  const getStatusColor = (status?: string) => {
    if (!status) return "bg-gray-500";
    switch (status.toUpperCase()) {
      case "AVAILABLE": return "bg-green-500";
      case "BOOKED": return "bg-red-500";
      case "HOLD": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  // Use the data attribute if provided, otherwise fall back to the position-based detection
  const isBelow = props["data-is-below"] !== undefined 
    ? props["data-is-below"] 
    : parseInt(top.replace('px', '') || '0', 10) > 300;

  return (
    <div
      style={{ 
        left, 
        top, 
        position: "fixed", 
        transform: isBelow ? "translate(-50%, 20px)" : "translate(-50%, -100%)" 
      }}
      className="z-[90] flex flex-col items-center cursor-pointer transition-opacity duration-200"
    >
      {isSelected && (
        <>
          {/* Show arrow pointing up if tooltip is below the unit */}
          {isBelow && (
            <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-gray-800/90 mb-[-1px]"></div>
          )}
          
          <div className="w-full max-w-[280px] bg-gray-800/90 backdrop-blur-sm rounded-lg p-4 shadow-lg text-white">
            <div className="flex items-center mb-2">
              <LocationIcon className="w-5 h-5" />
              <span className="ml-2 text-base font-medium">{selectedUnit.unit_number}</span>
              {selectedUnit.status && (
                <span className={`ml-2 capitalize px-2 py-0.5 text-xs rounded-full ${getStatusColor(selectedUnit.status)}`}>
                  {selectedUnit.status}
                </span>
              )}
            </div>
            <div className="text-sm text-gray-300 mb-2">{selectedUnit.unit_type}</div>
            
            {selectedUnit.area && (
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Area:</span>
                <span className="font-medium">{selectedUnit.area} sq.ft</span>
              </div>
            )}
            
            {selectedUnit.TotalCost && (
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Price:</span>
                <span className="font-medium">{formatCurrency(selectedUnit.TotalCost)}</span>
              </div>
            )}
            
            <button
              onClick={onExploreClick}
              className="mt-2 w-full px-3 py-1 bg-gray-700 rounded-md text-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label={`Explore unit ${selectedUnit.unit_number}`}
            >
              Explore
            </button>
          </div>
          
          {/* Show arrow pointing down if tooltip is above the unit */}
          {!isBelow && (
            <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-800/90 mt-[-1px]"></div>
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(UnitMark);