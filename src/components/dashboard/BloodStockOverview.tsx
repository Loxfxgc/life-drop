import React from 'react';
import BloodInventoryLevel from '../inventory/BloodInventoryLevel';
import StatCard from './StatCard';
import BloodDrop from '../common/BloodDrop';

// Mock data for blood inventory
const mockBloodInventory = [
  { type: 'A+' as const, level: 75, capacity: 100 },
  { type: 'A-' as const, level: 45, capacity: 50 },
  { type: 'B+' as const, level: 60, capacity: 80 },
  { type: 'B-' as const, level: 30, capacity: 40 },
  { type: 'AB+' as const, level: 15, capacity: 30 },
  { type: 'AB-' as const, level: 25, capacity: 20 },
  { type: 'O+' as const, level: 85, capacity: 150 },
  { type: 'O-' as const, level: 20, capacity: 70 },
];

const BloodStockOverview: React.FC = () => {
  // Calculate total units and critical levels
  const totalUnits = mockBloodInventory.reduce((acc, item) => acc + item.capacity, 0);
  const criticalTypes = mockBloodInventory.filter(item => item.level <= 20).length;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-red-50">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <BloodDrop size="md" color="red-600" animate />
          <span>Blood Stock Overview</span>
        </h3>
      </div>
      
      <div className="p-6">
        {/* Summary statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatCard 
            title="Total Blood Units" 
            value={totalUnits}
            icon={<BloodDrop size="sm" />}
            variant="primary"
          />
          
          <StatCard 
            title="Critical Types" 
            value={criticalTypes}
            change={{
              value: 15,
              isPositive: false
            }}
            variant="danger"
          />
          
          <StatCard 
            title="Donations This Week" 
            value={42}
            change={{
              value: 8,
              isPositive: true
            }}
            variant="success"
          />
        </div>
        
        {/* Blood inventory levels */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockBloodInventory.map((item) => (
            <BloodInventoryLevel
              key={item.type}
              type={item.type}
              level={item.level}
              capacity={item.capacity}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BloodStockOverview; 