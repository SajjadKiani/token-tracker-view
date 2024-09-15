import React from 'react';
import { BookmarkIcon, ExternalLinkIcon } from 'lucide-react';
import { useBookmark } from '../hooks/useBookmark';

const SearchResultCard = ({ pair }) => {
  const { isBookmarked, toggleBookmark } = useBookmark(pair);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 relative">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {pair.info?.imageUrl && (
            <img src={pair.info.imageUrl} alt={pair.baseToken.symbol} className="w-10 h-10 mr-2 rounded-full" />
          )}
          <h2 className="text-lg font-semibold">{`${pair.baseToken.symbol}/${pair.quoteToken.symbol}`}</h2>
        </div>
        <button
          onClick={() => toggleBookmark(pair)}
          className="text-gray-500 hover:text-yellow-500 transition-colors"
        >
          <BookmarkIcon className={`h-6 w-6 ${isBookmarked ? 'text-yellow-500 fill-current' : ''}`} />
        </button>
      </div>
      <p className="text-sm text-gray-600 mb-2">{`${pair.baseToken.name} / ${pair.quoteToken.name}`}</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p><strong>Chain:</strong> {pair.chainId}</p>
          <p><strong>DEX:</strong> {pair.dexId}</p>
          <p><strong>Price (USD):</strong> ${parseFloat(pair.priceUsd).toFixed(4)}</p>
          <p><strong>Price (Native):</strong> {pair.priceNative}</p>
        </div>
        <div>
          <p><strong>Liquidity (USD):</strong> ${pair.liquidity.usd.toLocaleString()}</p>
          <p><strong>FDV:</strong> ${pair.fdv.toLocaleString()}</p>
          <p><strong>Market Cap:</strong> ${pair.marketCap.toLocaleString()}</p>
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        <a
          href={pair.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-sm flex items-center hover:underline"
        >
          View on DEX <ExternalLinkIcon className="h-4 w-4 ml-1" />
        </a>
        {pair.info?.websites?.map((website, index) => (
          <a
            key={index}
            href={website.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-sm flex items-center hover:underline"
          >
            Website <ExternalLinkIcon className="h-4 w-4 ml-1" />
          </a>
        ))}
        {pair.info?.socials?.map((social, index) => (
          <a
            key={index}
            href={`https://${social.platform}.com/${social.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-sm flex items-center hover:underline"
          >
            {social.platform} <ExternalLinkIcon className="h-4 w-4 ml-1" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SearchResultCard;