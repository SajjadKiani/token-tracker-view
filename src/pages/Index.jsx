import React from 'react';
import { useQuery } from '@tanstack/react-query';
import CryptoCard from '../components/CryptoCard';
import BottomNavbar from '../components/BottomNavbar';

const fetchCryptoData = async () => {
  const response = await fetch('https://api.dexscreener.com/token-profiles/latest/v1');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['cryptoData'],
    queryFn: fetchCryptoData,
  });

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen">Error: {error.message}</div>;

  return (
    <div className="pb-16">
      <h1 className="text-2xl font-bold text-center my-4">Crypto Tracker</h1>
      <div className="space-y-4 px-4">
        {data && data.map((crypto, index) => (
          <CryptoCard key={index} crypto={crypto} />
        ))}
      </div>
      <BottomNavbar />
    </div>
  );
};

export default Index;
