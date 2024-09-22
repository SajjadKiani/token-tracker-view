import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, SearchIcon, BookmarkIcon, WalletIcon } from 'lucide-react';
import { Button } from 'react-day-picker';

const BottomNavbar = () => {
  const location = useLocation();

  const navItems = [
    { to: '/search', icon: SearchIcon, label: 'Search' },
    { to: '/', icon: HomeIcon, label: 'Home' },
    { to: '/wallet', icon: WalletIcon, label: 'Wallet' },
  ];

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <nav className="fixed bottom-4 left-20 rounded-full shadow-md right-20 bg-[#262626]/90 py-1">
      <div className="flex justify-around items-center">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`p-2 flex gap-1 items-center transition-all duration-500 ease-in-out ${
              location.pathname === item.to ? 'bg-primary text-white rounded-full ' : 'text-white'
            }`}
            onClick={() => handleScrollToTop()}
          >
            <item.icon className="h-6 w-6" />
            {/* {location.pathname === item.to && (
              <span className="text-xs font-bold">
                {item.label}
              </span>
            )} */}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavbar;
