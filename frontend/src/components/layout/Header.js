import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getUser } from '../../services/api';
import { Search, Bell } from '../icons/LucideIcons'; // Assuming LucideIcons is in ../icons
import { Avatar } from '../ui/Avatar'; // Assuming Avatar is in ../ui

const Header = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  const getTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/safety/ptw/')) return 'PTW Details';
    if (path.startsWith('/safety/ptw')) return 'Permit-to-Work System';
    if (path.startsWith('/crm/')) return 'Client Details';

    const rootPath = path.split('/')[1];
    if (!rootPath) return 'Dashboard';
    if (rootPath === 'work-orders') return 'Work Orders';
    if (rootPath === 'digital-twin') return 'Digital Twin';
    if (rootPath === 'safety') return 'HSEQ Dashboard';
    if (rootPath === 'crm') return 'Customer Relationship Management';
    if (rootPath === 'assets') return 'Asset Management';
    if (rootPath === 'maintenance') return 'Maintenance (CMMS)';
    if (rootPath === 'billing') return 'Billing & Invoicing';
    if (rootPath === 'admin') return 'System Administration';

    return rootPath.charAt(0).toUpperCase() + rootPath.slice(1).replace('-', ' ');
  };

  return (
    <header className="flex items-center justify-between h-24 px-8 bg-transparent">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{getTitle()}</h1>
        <p className="text-gray-500">
          {user ? `Welcome back, ${user.name}!` : 'Loading...'}
        </p>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          {/* Assuming Search icon is available */}
          {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" /> */}
          <input
            type="text"
            placeholder="Search here"
            className="pl-10 pr-4 py-2 w-64 bg-white rounded-lg focus:ring-2 focus:ring-sbp-brand-500 focus:outline-none border-transparent"
          />
        </div>
        <button className="relative text-gray-500 hover:text-sbp-brand-600">
          {/* Assuming Bell icon is available */}
          {/* <Bell className="w-6 h-6" /> */}
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </button>
        {user ? (
          <div className="flex items-center gap-3">
            {/* Assuming Avatar component is available */}
            {/* <Avatar
              src={user.avatarUrl}
              fallback={user.name.charAt(0)}
              className="w-10 h-10"
            /> */}
            <div>
              <p className="font-semibold text-sm text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
          </div>
        ) : (
          <div className="w-48 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        )}
      </div>
    </header>
  );
};

export default Header;