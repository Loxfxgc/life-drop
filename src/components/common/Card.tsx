import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  elevation?: 'none' | 'low' | 'medium' | 'high';
  bordered?: boolean;
  headerAction?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  footer,
  elevation = 'low',
  bordered = false,
  headerAction,
  className = '',
  ...props
}) => {
  // Shadow classes based on elevation
  const elevationClasses = {
    none: '',
    low: 'shadow-sm',
    medium: 'shadow-md',
    high: 'shadow-lg'
  };
  
  // Border classes
  const borderClasses = bordered ? 'border border-gray-200' : '';
  
  // Combined classes
  const cardClasses = `
    bg-white rounded-lg overflow-hidden 
    ${elevationClasses[elevation]} 
    ${borderClasses} 
    ${className}
  `;
  
  return (
    <div className={cardClasses} {...props}>
      {(title || subtitle || headerAction) && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              {title && <h3 className="text-lg font-semibold">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
            </div>
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}
      
      <div className="p-4">
        {children}
      </div>
      
      {footer && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 