import React from 'react';

const Search = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search</h1>
      <input
        type="text"
        placeholder="Search for cryptocurrencies..."
        className="w-full p-2 border border-gray-300 rounded-md"
      />
      {/* Add search functionality here */}
    </div>
  );
};

export default Search;