import React from 'react';
import { BloodInventory } from '../../api/inventoryService';

interface BloodAvailabilityProps {
  inventory: BloodInventory[];
  onSelectBloodType?: (bloodType: string) => void;
  selectedBloodType?: string;
}

const BloodAvailability: React.FC<BloodAvailabilityProps> = ({ 
  inventory, 
  onSelectBloodType,
  selectedBloodType
}) => {
  // Helper function to determine color based on availability
  const getAvailabilityColor = (available: number): string => {
    if (available <= 0) return 'bg-red-100 text-red-800'; // Critical
    if (available < 3) return 'bg-yellow-100 text-yellow-800'; // Low
    return 'bg-green-100 text-green-800'; // Normal
  };

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Blood Type</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Available</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Requested</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Select</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {inventory.map((item) => (
            <tr key={item.bloodType} className="hover:bg-gray-50">
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">
                <span className="inline-flex items-center">
                  <span className={`w-2.5 h-2.5 rounded-full mr-2 ${item.bloodType.includes('-') ? 'bg-red-600' : 'bg-red-500'}`} />
                  {item.bloodType}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(item.available)}`}>
                  {item.available} units
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {item.requested > 0 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {item.requested} units
                  </span>
                ) : (
                  <span className="text-gray-400">None</span>
                )}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {onSelectBloodType && (
                  <button
                    type="button"
                    onClick={() => onSelectBloodType(item.bloodType)}
                    className={`inline-flex items-center px-3 py-1.5 border rounded-md text-xs font-medium 
                      ${selectedBloodType === item.bloodType 
                        ? 'bg-red-600 text-white border-red-600 hover:bg-red-700' 
                        : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'}`}
                  >
                    {selectedBloodType === item.bloodType ? 'Selected' : 'Select'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BloodAvailability; 