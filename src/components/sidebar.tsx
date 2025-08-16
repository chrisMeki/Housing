import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Map, Home, Search, Users, List, Settings, Bell, FileText, BarChart3, User, ChevronRight, X } from 'lucide-react';
import logo from '../assets/images/logo.png'; // Adjust the path to your logo file

export default function HousingMappingSidebar({ isOpen = true, onClose = () => {} }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Logo component
  const Logo = () => (
    <div className="flex items-center">
      <img
        src={logo}
        alt="city council"
        className={`${isCollapsed ? 'w-10 h-10' : 'w-30 h-auto'} object-contain transition-all duration-300`}
      />
    </div>
  );

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', path: '/dashboard', color: 'text-blue-600' },
    { id: 'mapping', icon: Map, label: 'Property Mapping', path: '/mapping', color: 'text-green-600' },
    { id: 'registrations', icon: Users, label: 'Housing Registration', path: '/registrations', color: 'text-purple-600' },
    { id: 'reports', icon: FileText, label: 'Reports & Documents', path: '/reports', color: 'text-red-600' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', path: '/analytics', color: 'text-indigo-600' },
    { id: 'search', icon: Search, label: 'Search Properties', path: '/search', color: 'text-orange-600' },
    { id: 'listings', icon: List, label: 'Property Listings', path: '/listings', color: 'text-teal-600' },
    { id: 'profile', icon: User, label: 'User Profile', path: '/profile', color: 'text-gray-600' },
    { id: 'logout', icon: User, label: 'Logout', path: '/logout', color: 'text-gray-600' },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden animate-fadeIn"
          onClick={onClose}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-16' : 'w-72'
      } ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        {/* Glass container */}
        <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-lg border-r border-gray-200/30 shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200/30 flex-shrink-0">
            <div className="flex items-center justify-between">
              <Logo />
              <button
                onClick={onClose}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100/50 transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            {/* Navigation Menu */}
            <nav className="p-4">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.id}
                      to={item.path}
                      className={({ isActive }) => 
                        `w-full flex items-center px-3 py-3 rounded-lg transition-all duration-200 group ${
                          isActive 
                            ? 'bg-blue-50/70 border-l-4 border-blue-500 text-blue-700' 
                            : 'hover:bg-gray-50/50 text-gray-700'
                        }`
                      }
                      onClick={() => {
                        // Close mobile sidebar after navigation
                        if (window.innerWidth < 1024) {
                          onClose();
                        }
                      }}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon className={`w-5 h-5 ${isActive ? item.color : 'text-gray-500'} group-hover:scale-110 transition-transform`} />
                          {!isCollapsed && (
                            <span className="ml-3 font-medium">{item.label}</span>
                          )}
                          {isActive && !isCollapsed && (
                            <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>

        {/* Custom Animations */}
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          
          .animate-fadeIn {
            animation: fadeIn 0.2s ease-out;
          }

          /* Custom scrollbar for webkit browsers */
          .overflow-y-auto::-webkit-scrollbar {
            width: 6px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-track {
            background: rgba(241, 245, 249, 0.3);
            border-radius: 3px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-thumb {
            background: rgba(203, 213, 225, 0.5);
            border-radius: 3px;
          }
          
          .overflow-y-auto::-webkit-scrollbar-thumb:hover {
            background: rgba(148, 163, 184, 0.7);
          }
        `}</style>
      </div>
    </>
  );
}