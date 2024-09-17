import React from 'react';
import { BookmarkIcon } from 'lucide-react';
import { useBookmark } from '../hooks/useBookmark';
import { Link } from 'react-router-dom';
import { useSupabaseAuth } from '../integrations/supabase';

const CryptoCard = ({ crypto }) => {
  const { isBookmarked, toggleBookmark } = useBookmark(crypto);
  const { session } = useSupabaseAuth();

  if (!crypto) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 relative">
      <div className='w-100'>
        {crypto.header && (
          <img 
            src={crypto.header} 
            alt='header' 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/300x100?text=Header+Image+Not+Available';
            }}
          />
        )}
      </div>
      <div className="flex justify-between mt-5 items-center mb-2">
        {crypto.icon && (
          <img 
            src={crypto.icon} 
            alt={crypto.header} 
            className="w-10 h-10 mr-2 rounded-full"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/40?text=Icon';
            }}
          />
        )}
        {session?.user && (
          <button
            onClick={() => toggleBookmark(crypto)}
            className="text-gray-500 hover:text-yellow-500 transition-colors"
          >
            <BookmarkIcon className={`h-6 w-6 ${isBookmarked ? 'text-yellow-500 fill-current' : ''}`} />
          </button>
        )}
      </div>
      {crypto.description && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-3">{crypto.description}</p>
      )}
      <div className="text-xs text-gray-500">
        {crypto.chainId && <p>Chain ID: {crypto.chainId}</p>}
        {crypto.tokenAddress && (
          <p className='truncate'>
            Token Address: <br />
            <Link
              to={`/token/${crypto.chainId}/${crypto.tokenAddress}`}
              className="text-blue-500 hover:underline"
            >
              {crypto.tokenAddress}
            </Link>
          </p>
        )}
        {crypto.amount !== undefined && <p>Amount: {crypto.amount}</p>}
        {crypto.totalAmount !== undefined && <p>Total Amount: {crypto.totalAmount}</p>}
      </div>
      {crypto.links && crypto.links.length > 0 && (
        <div className="mt-2">
          {crypto.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="text-blue-500 text-sm mr-2 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default CryptoCard;
