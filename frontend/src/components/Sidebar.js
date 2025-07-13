import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Target, BarChart3, Brain } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Content Browser',
      description: 'Browse and interact with content'
    },
    {
      path: '/ads',
      icon: Target,
      label: 'Personalized Ads',
      description: 'View your personalized ads'
    },
    {
      path: '/analytics',
      icon: BarChart3,
      label: 'Analytics',
      description: 'View your behavior analytics'
    },
    {
      path: '/ml',
      icon: Brain,
      label: 'ML Dashboard',
      description: 'Machine learning insights'
    }
  ];

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="space-y-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-start space-x-3 p-3 rounded-lg transition-colors duration-200 group ${
                    isActive
                      ? 'bg-primary-50 text-primary-700 border border-primary-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-gray-500 group-hover:text-gray-600">
                    {item.description}
                  </p>
                </div>
              </NavLink>
            );
          })}
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-500 space-y-2">
            <p className="font-medium text-gray-700">Demo Features:</p>
            <ul className="space-y-1">
              <li>• Real-time behavior tracking</li>
              <li>• ML-powered interest prediction</li>
              <li>• Personalized ad recommendations</li>
              <li>• Interactive analytics dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 