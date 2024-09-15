import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Icon } from 'lucide-react';
import { astronautHelmet } from '@lucide/lab';
import { ModeToggle } from './mode-toggle';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1);
  };

  const getTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Crypto Tracker';
      case '/search':
        return 'Search';
      case '/bookmark':
        return 'Bookmarks';
      default:
        if (location.pathname.startsWith('/token/')) {
          return 'Token Details';
        }
        return 'Crypto Tracker';
    }
  };

  return (
    <div className='flex items-center justify-between px-5 bg-primary text-primary-foreground py-4'>
      {location.pathname !== '/' && (
        <button onClick={handleBack} className="text-primary-foreground">
          <ArrowLeft className="h-6 w-6" />
        </button>
      )}
      <h1 className="text-2xl font-bold">{getTitle()}</h1>
      <div className="flex items-center space-x-2">
        <ModeToggle />
        <Icon iconNode={astronautHelmet} className="h-6 w-6" />
      </div>
    </div>
  );
};

export default Header;
