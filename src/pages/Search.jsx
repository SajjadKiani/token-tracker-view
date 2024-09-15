import React, { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { debounce } from 'lodash';
import { Loader } from 'lucide-react';
import SearchResultCard from '../components/SearchResultCard';
import Header from '../components/Header';
import { Input } from '@/components/ui/input';

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSearchResults = async (query) => {
    if (!query) return { pairs: [] };
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
          <SearchResultCard key={index} pair={pair} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-primary">
      <Header />
      <div className='rounded-t-3xl pt-6 bg-background mt-4 px-4 shadow-t-xl'>
        <Input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for tokens (e.g., SOL/USDT)"
        />
        {renderSearchResults()}
      </div>
    </div>
  );
};

export default Search;
