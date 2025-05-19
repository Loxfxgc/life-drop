import React, { ReactNode } from 'react';

type StatVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  variant?: StatVariant;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  variant = 'primary',
  className = '',
}) => {
  // Get variant specific styling
  const getVariantClass = (variant: StatVariant) => {
    switch (variant) {
      case 'primary':
        return 'border-red-500';
      case 'secondary':
        return 'border-blue-500';
      case 'success':
        return 'border-green-500';
      case 'warning':
        return 'border-yellow-500';
      case 'danger':
        return 'border-red-700';
      default:
        return 'border-gray-300';
    }
  };

  // Icon background styling
  const getIconBgClass = (variant: StatVariant) => {
    switch (variant) {
      case 'primary':
        return 'bg-red-100 text-red-600';
      case 'secondary':
        return 'bg-blue-100 text-blue-600';
      case 'success':
        return 'bg-green-100 text-green-600';
      case 'warning':
        return 'bg-yellow-100 text-yellow-600';
      case 'danger':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className={`stat-card ${getVariantClass(variant)} ${className}`}>
      <div className="flex items-center justify-between">
        {/* Left side - Title and value */}
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            
            {/* Change indicator */}
            {change && (
              <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                change.isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                <span className="sr-only">{change.isPositive ? 'Increased' : 'Decreased'} by</span>
                {change.isPositive ? (
                  <svg className="self-center flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="self-center flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{Math.abs(change.value)}%</span>
              </p>
            )}
          </div>
        </div>
        
        {/* Right side - Icon */}
        {icon && (
          <div className={`p-3 rounded-full ${getIconBgClass(variant)}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard; 