import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import CryptoCard from '../components/CryptoCard';
import { Loader } from 'lucide-react';
import Header from '../components/Header';

const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedChainId, setSelectedChainId] = useState("all");

  const { data: cryptoData, isLoading, error } = useQuery({
    queryKey: ['cryptoData'],
    queryFn: () => fetchData('https://api.example.com/crypto'), // Replace with actual API endpoint
  });

  const chainIds = useMemo(() => {
    if (!cryptoData) return [];
    const uniqueChainIds = [...new Set(cryptoData.map(item => item.chainId))];
    return ["all", ...uniqueChainIds.sort()];
  }, [cryptoData]);

  const filteredData = useMemo(() => {
    if (!cryptoData) return [];
    return cryptoData.filter(crypto => 
      (selectedChainId === "all" || crypto.chainId === selectedChainId) &&
      (activeTab === "all" || 
       (activeTab === "gainers" && crypto.priceChange24h > 0) ||
       (activeTab === "losers" && crypto.priceChange24h < 0))
    );
  }, [cryptoData, selectedChainId, activeTab]);

  const renderContent = () => {
    if (isLoading) return <div className="flex justify-center items-center h-40">
      <Loader className='animate-spin text-primary w-8 h-8' />
    </div>;
    if (error) return <div className="flex justify-center items-center h-40 text-destructive">Error: {error.message}</div>;
    if (filteredData.length === 0) return <p className="text-center text-muted">No data available</p>;

    return (
      <div className="space-y-4">
        {filteredData.map((crypto, index) => (
          <CryptoCard key={index} crypto={crypto} />
        ))}
      </div>
    );
  };

  return (
    <div className="pb-16 bg-background">
      <Header />
      <div className='pt-6 px-4'>
        <input
          type="text"
          placeholder="Search coin pairs"
          className="search-bar mb-4"
        />
        <div className="mb-4">
          <select 
            value={selectedChainId} 
            onChange={(e) => setSelectedChainId(e.target.value)}
            className="w-full bg-background border border-muted rounded-md px-2 py-1"
          >
            {chainIds.map((chainId) => (
              <option key={chainId} value={chainId}>
                {chainId === "all" ? "All Chains" : `Chain ${chainId}`}
              </option>
            ))}
          </select>
        </div>
        <div className="tab-list">
          <button 
            className={`tab ${activeTab === "all" ? "active" : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Cryptos
          </button>
          <button 
            className={`tab ${activeTab === "gainers" ? "active" : ""}`}
            onClick={() => setActiveTab("gainers")}
          >
            Gainers
          </button>
          <button 
            className={`tab ${activeTab === "losers" ? "active" : ""}`}
            onClick={() => setActiveTab("losers")}
          >
            Losers
          </button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default Index;
