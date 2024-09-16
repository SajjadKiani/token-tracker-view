import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Icon, User } from 'lucide-react';
import { astronautHelmet } from '@lucide/lab';
import { useSupabaseAuth } from '@/integrations/supabase';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { session } = useSupabaseAuth();

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
      case '/login':
        return 'Login';
      case '/signup':
        return 'Sign Up';
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
        <button onClick={handleBack} className="text-white">
          <ArrowLeft className="h-6 w-6" />
        </button>
      )}
      <h1 className="text-2xl font-bold">{getTitle()}</h1>
      <div className='flex gap-2'>
        { session &&
          <div className='border-2 rounded-full'>
            <User className='h-5 w-5' />
          </div>
        }
        <Icon iconNode={astronautHelmet} className="h-6 w-6" />
      </div>
    </div>
  );
};

export default Header;
