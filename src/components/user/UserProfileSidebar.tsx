
import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Wallet, 
  Settings, 
  HelpCircle
} from 'lucide-react';

export const UserProfileSidebar:React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');

  const sidebarItems = [
    {
      id: 'profile',
      label: 'Profile Info',
      icon: User
    },
    {
      id: 'bookings',
      label: 'My Bookings',
      icon: Calendar
    },
    {
      id: 'wallet',
      label: 'Wallet & Payments',
      icon: Wallet
    },
    {
      id: 'settings',
      label: 'Account Settings',
      icon: Settings
    },
    {
      id: 'support',
      label: 'Help & Support',
      icon: HelpCircle
    }
  ];

  return (
    <aside className="w-72 bg-gray-50 h-full border-r border-gray-100">
      <nav className="p-4 pt-6">
        <ul className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 py-3 px-4 rounded transition-colors ${
                    isActive
                      ? "bg-white text-gray-800 shadow-sm font-medium"
                      : "text-gray-700 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};