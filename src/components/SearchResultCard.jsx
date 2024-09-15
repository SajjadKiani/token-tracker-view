import React from 'react';
import { ArrowDown, ArrowUp, BookmarkIcon, ExternalLinkIcon } from 'lucide-react';
import { useBookmark } from '../hooks/useBookmark';
import { Link } from 'react-router-dom';
import { Separator } from './ui/separator';
import moment from 'moment';

const SearchResultCard = ({ pair }) => {
  const { isBookmarked, toggleBookmark } = useBookmark(pair);

  // Helper function to safely format numbers
  const formatNumber = (value) => {
    return value ? value.toLocaleString() : 'N/A';
  };

  const formatPriceChange = (value) => {
    try{
      const priceChange = parseInt(value)
      return (
        <span className={`${priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {priceChange}%
          {priceChange >= 0 ?
            <ArrowUp className='w-3 h-3 text-green-500 inline-block' />
            :
            <ArrowDown className='w-3 h-3 text-red-500 inline-block' />
          }
        </span>
      )
    } catch {
      <span>N/A</span>
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 relative">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          {pair.info?.imageUrl && (
            <img src={pair.info.imageUrl} alt={pair.baseToken?.symbol} className="w-10 h-10 mr-2 rounded-full" />
          )}
          <h2 className="text-lg font-semibold">{`${pair.baseToken?.symbol || 'Unknown'}/${pair.quoteToken?.symbol || 'Unknown'}`}</h2>
        </div>
        {/* <button
          onClick={() => toggleBookmark(pair)}
          className="text-gray-500 hover:text-yellow-500 transition-colors"
        >
          <BookmarkIcon className={`h-6 w-6 ${isBookmarked ? 'text-yellow-500 fill-current' : ''}`} />
        </button> */}
      </div>
      <p className="text-sm text-gray-600 mb-2">{`${pair.baseToken?.name || 'Unknown'} / ${pair.quoteToken?.name || 'Unknown'}`}</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p><strong>Chain:</strong> {pair.chainId || 'N/A'}</p>
          <p><strong>DEX:</strong> {pair.dexId || 'N/A'}</p>
          <p><strong>Price (USD):</strong> ${pair.priceUsd ? parseFloat(pair.priceUsd) : 'N/A'}</p>
          <p><strong>Price (Native):</strong> {pair.priceNative || 'N/A'}</p>
        </div>
        <div>
          <p><strong>Liquidity (USD):</strong> ${formatNumber(pair.liquidity?.usd)}</p>
          <p><strong>FDV:</strong> ${formatNumber(pair.fdv)}</p>
          <p><strong>Market Cap:</strong> ${formatNumber(pair.marketCap)}</p>
          <p><strong>CreatedAt:</strong> {moment(pair.pairCreatedAt).fromNow()}</p>
        </div>
      </div>
      <Separator />
      {['m5', 'h1', 'h6', 'h24'].map((time, index) =>
      <div className='text-sm grid grid-cols-3' key={index} >
          <strong className='mr-2'> {time}: </strong>
          <p>{formatPriceChange(pair?.priceChange?.[time])} </p>
          <p>${formatNumber(pair?.volume?.[time])} </p>
      </div>
      )}
      <Separator />
      <div className="mt-2 flex flex-wrap gap-2">
        {pair.url && (
          <a
            href={pair.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-sm flex items-center hover:underline"
          >
            View on DEX <ExternalLinkIcon className="h-4 w-4 ml-1" />
          </a>
        )}
        {pair.baseToken?.address && (
          <Link
            to={`/token/${pair.chainId}/${pair.baseToken.address}`}
            className="text-blue-500 text-sm flex items-center hover:underline"
          >
            Token Details <ExternalLinkIcon className="h-4 w-4 ml-1" />
          </Link>
        )}
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
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 text-sm flex items-center hover:underline"
          >
            {social.type} <ExternalLinkIcon className="h-4 w-4 ml-1" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default SearchResultCard;
