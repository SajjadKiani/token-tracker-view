import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, SearchIcon, BookmarkIcon } from 'lucide-react';

const BottomNavbar = () => {
  const location = useLocation();

  const navItems = [
    { to: '/', icon: HomeIcon, label: 'Home' },
    { to: '/search', icon: SearchIcon, label: 'Search' },
    { to: '/bookmark', icon: BookmarkIcon, label: 'Bookmark' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center py-2 px-4 ${
              location.pathname === item.to ? 'text-blue-500' : 'text-gray-500'
            }`}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavbar;