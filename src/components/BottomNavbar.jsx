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
    <nav className="fixed bottom-4 left-4 rounded-[18px] shadow-md right-4 bg-primary/90 py-1">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`p-2 flex gap-1 items-center transition-all duration-500 ease-in-out ${
              location.pathname === item.to ? 'text-primary bg-white rounded-full ' : 'text-white'
            }`}
          >
            <item.icon className="h-6 w-6" />
            {location.pathname === item.to && (
              <span className="text-xs font-bold">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavbar;