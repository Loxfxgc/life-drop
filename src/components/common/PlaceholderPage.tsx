import React from 'react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ 
  title, 
  description = 'This page is under construction.' 
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <p className="text-lg">{description}</p>
    </div>
  );
};

export default PlaceholderPage; 