import React from 'react';

type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

interface BloodTypeBadgeProps {
  type: BloodType;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const BloodTypeBadge: React.FC<BloodTypeBadgeProps> = ({
  type,
  size = 'md',
  className = '',
}) => {
  // Define base class for all blood types
  const baseClass = 'inline-flex items-center justify-center font-bold rounded-full';
  
  // Define size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  
  // Define color classes based on blood type
  const getColorClass = (bloodType: BloodType) => {
    const baseType = bloodType.charAt(0);
    
    switch (baseType) {
      case 'A':
        return bloodType.includes('AB') 
          ? 'bg-purple-100 text-purple-800'
          : 'bg-red-100 text-red-800';
      case 'B':
        return 'bg-blue-100 text-blue-800';
      case 'O':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <span className={`${baseClass} ${sizeClasses[size]} ${getColorClass(type)} ${className}`}>
      {type}
    </span>
  );
};

export default BloodTypeBadge; 