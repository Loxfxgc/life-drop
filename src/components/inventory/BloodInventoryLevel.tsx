import React from 'react';
import BloodTypeBadge from '../common/BloodTypeBadge';

type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

interface BloodInventoryLevelProps {
  type: BloodType;
  level: number; // Percentage 0-100
  capacity?: number; // Total units
  className?: string;
}

const BloodInventoryLevel: React.FC<BloodInventoryLevelProps> = ({
  type,
  level,
  capacity,
  className = '',
}) => {
  // Determine the color based on inventory level
  const getColorClass = (level: number) => {
    if (level <= 20) return 'bg-red-600';
    if (level <= 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  // Format the capacity text
  const formattedCapacity = capacity !== undefined ? `${Math.round((level / 100) * capacity)} / ${capacity} units` : `${level}%`;
  
  return (
    <div className={`inventory-level ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <BloodTypeBadge type={type} size="md" />
        <span className="text-sm font-medium text-gray-700">
          {formattedCapacity}
        </span>
      </div>
      
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${getColorClass(level)} transition-all duration-500 ease-in-out`}
          style={{ width: `${level}%` }}
        />
      </div>
      
      {/* Status indicator */}
      <div className="mt-2 text-xs font-medium">
        {level <= 20 ? (
          <span className="text-red-600">Critical - Urgent donations needed</span>
        ) : level <= 50 ? (
          <span className="text-yellow-600">Low - Donations welcome</span>
        ) : (
          <span className="text-green-600">Good - Well stocked</span>
        )}
      </div>
    </div>
  );
};

export default BloodInventoryLevel; 