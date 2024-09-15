import React from 'react';
import { BookmarkIcon } from 'lucide-react';
import { useBookmark } from '../hooks/useBookmark';
import { Link } from 'react-router-dom';

const CryptoCard = ({ crypto }) => {
  const { isBookmarked, toggleBookmark } = useBookmark(crypto);

  if (!crypto) {
    return null;
  }

  return (
    <div className="crypto-card">
      <div className="crypto-card-header">
        <div className="flex items-center">
          {crypto.icon && (
            <img src={crypto.icon} alt={crypto.name} className="w-8 h-8 mr-2 rounded-full" />
          )}
          <div>
            <h2 className="crypto-card-title">{crypto.name}</h2>
            <p className="text-xs text-muted">{crypto.symbol}</p>
          </div>
        </div>
        <button
          onClick={() => toggleBookmark(crypto)}
          className="text-muted hover:text-secondary transition-colors"
        >
          <BookmarkIcon className={`h-6 w-6 ${isBookmarked ? 'text-secondary fill-current' : ''}`} />
        </button>
      </div>
      <div className="flex justify-between items-center mt-2">
        <p className="crypto-card-price">${crypto.price?.toFixed(2)}</p>
        <p className={`crypto-card-change ${crypto.priceChange24h > 0 ? 'positive-change' : 'negative-change'}`}>
          {crypto.priceChange24h > 0 ? '+' : ''}{crypto.priceChange24h?.toFixed(2)}%
        </p>
      </div>
      <div className="mt-2 text-xs text-muted">
        <p>Chain ID: {crypto.chainId}</p>
        <p className="truncate">
          Token Address: <Link to={`/token/${crypto.chainId}/${crypto.tokenAddress}`} className="text-primary hover:underline">
            {crypto.tokenAddress}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CryptoCard;
