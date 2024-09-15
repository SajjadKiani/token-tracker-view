import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Icon, Moon, Sun } from 'lucide-react';
import { astronautHelmet } from '@lucide/lab';
import { useTheme } from './theme-provider';
import { Button } from './ui/button';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className='flex items-center justify-between px-5 bg-primary text-primary-foreground py-4'>
      {location.pathname !== '/' && (
        <button onClick={handleBack} className="text-primary-foreground">
          <ArrowLeft className="h-6 w-6" />
        </button>
      )}
      <h1 className="text-2xl font-bold">{getTitle()}</h1>
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
        </Button>
        <Icon iconNode={astronautHelmet} className="h-6 w-6 ml-2" />
      </div>
    </div>
  );
};

export default Header;
