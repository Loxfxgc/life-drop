import React from 'react';

interface BloodDropProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  animate?: boolean;
  className?: string;
}

const BloodDrop: React.FC<BloodDropProps> = ({
  size = 'md',
  color = 'red-600',
  animate = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-6',
    md: 'w-6 h-8',
    lg: 'w-8 h-12',
  };
  
  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <svg 
        viewBox="0 0 24 36" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`${animate ? 'animate-beat' : ''}`}
      >
        <path 
          d="M12 3.5C12 3.5 3 12.5 3 21.5C3 28 7 33.5 12 33.5C17 33.5 21 28 21 21.5C21 12.5 12 3.5 12 3.5Z" 
          fill={`currentColor`}
          className={`text-${color}`}
        />
        <path 
          d="M13.5 22.5C13.5 22.5 15 19.5 15 18C15 16.5 13.6569 15.5 12 15.5C10.3431 15.5 9 16.5 9 18C9 19.5 10.5 22.5 10.5 22.5C10.5 22.5 11.5 21.5 12 21.5C12.5 21.5 13.5 22.5 13.5 22.5Z" 
          fill="white"
        />
      </svg>
    </div>
  );
};

export default BloodDrop; 