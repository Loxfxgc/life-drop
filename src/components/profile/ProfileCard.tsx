import React from 'react';
import { Link } from 'react-router-dom';

interface ProfileCardProps {
  user: {
    id: string;
    name: string;
    email: string | null;
    photoURL?: string | null;
    role: string;
    bloodType?: string;
    donorStatus?: string;
    donationCount?: number;
    lastDonation?: string;
  };
  className?: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ user, className = '' }) => {
  return (
    <div className={`profile-card ${className}`}>
      <div className="profile-header">
        <div className="profile-avatar">
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="h-full w-full rounded-full bg-red-600 flex items-center justify-center text-white text-4xl font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
      
      <div className="profile-content">
        <h2 className="text-xl font-bold text-center text-gray-900">{user.name}</h2>
        <p className="text-gray-500 text-center mb-4">{user.email}</p>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <span className="text-xs text-gray-500 uppercase">Role</span>
              <div className="mt-1 font-medium capitalize">{user.role}</div>
            </div>
            
            <div className="text-center">
              <span className="text-xs text-gray-500 uppercase">Blood Type</span>
              <div className="mt-1 font-medium">
                {user.bloodType || 'Not specified'}
              </div>
            </div>
            
            {user.donorStatus && (
              <div className="text-center col-span-2">
                <span className="text-xs text-gray-500 uppercase">Donor Status</span>
                <div className="mt-1">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.donorStatus === 'Active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user.donorStatus}
                  </span>
                </div>
              </div>
            )}
            
            {user.donationCount !== undefined && (
              <div className="text-center">
                <span className="text-xs text-gray-500 uppercase">Donations</span>
                <div className="mt-1 font-medium">{user.donationCount}</div>
              </div>
            )}
            
            {user.lastDonation && (
              <div className="text-center">
                <span className="text-xs text-gray-500 uppercase">Last Donation</span>
                <div className="mt-1 font-medium">{user.lastDonation}</div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex flex-col space-y-2">
          <Link
            to="/profile/edit"
            className="btn-outline w-full text-center"
          >
            Edit Profile
          </Link>
          
          {user.role === 'donor' && (
            <Link
              to="/appointment"
              className="btn-primary w-full text-center"
            >
              Schedule Donation
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard; 