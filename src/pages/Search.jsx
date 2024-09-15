import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { Loader } from 'lucide-react';
import CryptoCard from '../components/CryptoCard';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSearchResults = async (query) => {
    if (!query) return [];
    const response = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${query}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const debouncedFetchSearchResults = useCallback(
    debounce((query) => fetchSearchResults(query), 300),
    []
  );

  const { data, isLoading, error } = useQuery({
    queryKey: ['searchResults', searchTerm],
    queryFn: () => debouncedFetchSearchResults(searchTerm),
    enabled: searchTerm.length > 0,
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const renderSearchResults = () => {
    if (isLoading) return <Loader className="animate-spin text-primary w-8 h-8 mx-auto mt-4" />;
    if (error) return <p className="text-red-500 mt-4">Error: {error.message}</p>;
    if (!data || !data.pairs || data.pairs.length === 0) return <p className="text-center mt-4">No results found</p>;

    return (
      <div className="space-y-4 mt-4">
        {data.pairs.map((pair, index) => (
          <CryptoCard
            key={index}
            crypto={{
              chainId: pair.chainId,
              tokenAddress: pair.baseToken.address,
              icon: pair.info?.imageUrl,
              description: `${pair.baseToken.symbol}/${pair.quoteToken.symbol}`,
              links: [
                { label: 'View on DEX', url: pair.url },
                ...(pair.info?.websites?.map(website => ({ label: 'Website', url: website.url })) || []),
                ...(pair.info?.socials?.map(social => ({ label: social.platform, url: `https://${social.platform}.com/${social.handle}` })) || []),
              ],
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search for cryptocurrencies..."
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      {renderSearchResults()}
    </div>
  );
};

export default Search;
