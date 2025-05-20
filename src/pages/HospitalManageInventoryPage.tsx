import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import Card from '../components/common/Card';
import BloodTypeBadge from '../components/common/BloodTypeBadge';
import { hospitalService, HospitalProfile, HospitalBloodInventory } from '../api/hospitalService';
import { BLOOD_TYPES } from '../constants/bloodTypes';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { ROUTES } from '../constants/routes';

const HospitalManageInventoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State for hospital data
  const [hospital, setHospital] = useState<HospitalProfile | null>(null);
  const [inventory, setInventory] = useState<HospitalBloodInventory[]>([]);
  
  // Load hospital data on component mount
  useEffect(() => {
    const fetchHospitalData = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      if (user.role !== 'hospital') {
        showNotification({
          type: 'error',
          message: 'You do not have permission to access this page'
        });
        navigate('/');
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Get hospital profile
        const hospitalData = await hospitalService.getHospitalByUserId(user.id);
        
        if (!hospitalData) {
          showNotification({
            type: 'error',
            message: 'Hospital profile not found'
          });
          navigate(ROUTES.HOSPITAL_DASHBOARD);
          return;
        }
        
        if (!hospitalData.isVerified) {
          showNotification({
            type: 'warning',
            message: 'Your hospital account is not verified yet'
          });
          navigate(ROUTES.HOSPITAL_DASHBOARD);
          return;
        }
        
        setHospital(hospitalData);
        
        // Get hospital inventory
        const inventoryData = await hospitalService.getHospitalInventory(hospitalData.id!);
        
        // If inventory is empty, initialize with all blood types
        if (inventoryData.length === 0) {
          const initialInventory = BLOOD_TYPES.map(bloodType => ({
            hospitalId: hospitalData.id!,
            bloodType: bloodType.value,
            availableUnits: 0
          }));
          setInventory(initialInventory);
        } else {
          setInventory(inventoryData);
        }
      } catch (error) {
        console.error('Error fetching hospital data:', error);
        showNotification({
          type: 'error',
          message: 'Failed to load hospital data'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHospitalData();
  }, [user, navigate, showNotification]);
  
  // Handle inventory change
  const handleInventoryChange = (id: string | undefined, bloodType: string, value: number) => {
    setInventory(prevInventory => 
      prevInventory.map(item => 
        (item.id === id || (!item.id && item.bloodType === bloodType))
          ? { ...item, availableUnits: value }
          : item
      )
    );
  };
  
  // Handle delete inventory item
  const handleDeleteInventoryItem = async (id: string | undefined) => {
    if (!id) return;
    
    try {
      await hospitalService.deleteInventoryItem(id);
      
      // Update local state
      setInventory(prevInventory => 
        prevInventory.filter(item => item.id !== id)
      );
      
      showNotification({
        type: 'success',
        message: 'Inventory item deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      showNotification({
        type: 'error',
        message: 'Failed to delete inventory item'
      });
    }
  };
  
  // Handle save inventory
  const handleSaveInventory = async () => {
    if (!hospital || !hospital.id) {
      showNotification({
        type: 'error',
        message: 'Hospital information missing'
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Save each inventory item
      for (const item of inventory) {
        if (item.id) {
          // Update existing inventory item
          await hospitalService.updateInventoryItem(item.id, {
            availableUnits: item.availableUnits
          });
        } else {
          // Create new inventory item if it doesn't exist
          const newItem = {
            hospitalId: hospital.id,
            bloodType: item.bloodType,
            availableUnits: item.availableUnits
          };
          
          const docRef = await addDoc(collection(db, 'hospitalInventory'), {
            ...newItem,
            lastUpdated: serverTimestamp()
          });
          
          // Update local state with new ID
          setInventory(prev => 
            prev.map(prevItem => 
              prevItem.bloodType === item.bloodType
                ? { ...prevItem, id: docRef.id }
                : prevItem
            )
          );
        }
      }
      
      showNotification({
        type: 'success',
        message: 'Blood inventory updated successfully'
      });
      
      // Navigate back to dashboard
      navigate(ROUTES.HOSPITAL_DASHBOARD);
    } catch (error) {
      console.error('Error updating inventory:', error);
      showNotification({
        type: 'error',
        message: 'Failed to update inventory'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Get status badge for blood level
  const getStatusBadge = (units: number) => {
    if (units > 10) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Sufficient
        </span>
      );
    } else if (units > 5) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Low
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Critical
        </span>
      );
    }
  };
  
  if (isLoading) {
    return (
      <div className="manage-inventory-page">
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Manage Blood Inventory</h1>
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4 text-center">
            <p>Loading...</p>
          </div>
        </section>
      </div>
    );
  }
  
  return (
    <div className="manage-inventory-page">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Manage Blood Inventory</h1>
          <p className="mt-2 text-blue-100">
            Update your hospital's blood inventory levels
          </p>
        </div>
      </section>
      
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 max-w-5xl">
          <Card title="Blood Inventory Management">
            <div className="mb-6">
              <p className="text-gray-600">
                Update the available units for each blood type in your hospital inventory.
                Maintaining accurate inventory is critical for blood request fulfillment.
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blood Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Available Units
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventory.map((item) => (
                    <tr key={item.id || item.bloodType}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <BloodTypeBadge type={item.bloodType as any} size="md" />
                          <span className="ml-2 text-sm text-gray-900">{item.bloodType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          min="0"
                          value={item.availableUnits}
                          onChange={(e) => handleInventoryChange(item.id, item.bloodType, parseInt(e.target.value) || 0)}
                          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-24 sm:text-sm border-gray-300 rounded-md"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(item.availableUnits)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        Last updated: {item.lastUpdated ? new Date(item.lastUpdated.toDate()).toLocaleDateString() : 'Not yet updated'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {item.id && (
                          <button
                            onClick={() => handleDeleteInventoryItem(item.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete this inventory item"
                          >
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-8 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate(ROUTES.HOSPITAL_DASHBOARD)}
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveInventory}
                className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Inventory'}
              </button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default HospitalManageInventoryPage; 