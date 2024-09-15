import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, SearchIcon, BookmarkIcon, BarChart2Icon } from 'lucide-react';

const BottomNavbar = () => {
  const location = useLocation();

  const navItems = [
    { to: '/', icon: HomeIcon, label: 'Home' },
    { to: '/search', icon: SearchIcon, label: 'Search' },
    { to: '/bookmark', icon: BookmarkIcon, label: 'Bookmark' },
    { to: '/chart', icon: BarChart2Icon, label: 'Chart' },
  ];

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-content">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`bottom-nav-item ${location.pathname === item.to ? 'active' : ''}`}
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
