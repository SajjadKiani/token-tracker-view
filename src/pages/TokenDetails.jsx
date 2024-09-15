import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import Header from '../components/Header';

const TokenDetails = () => {
  const { chainId, tokenAddress } = useParams();

  const fetchTokenDetails = async () => {
    const response = await fetch(`https://api.dexscreener.com/orders/v1/${chainId}/${tokenAddress}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['tokenDetails', chainId, tokenAddress],
    queryFn: fetchTokenDetails,
  });

  const renderContent = () => {
    if (isLoading) return <div className="flex justify-center items-center h-40"><Loader className="animate-spin text-primary w-8 h-8" /></div>;
    if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

    const tokenProfile = data?.[0];

    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <p><strong>Chain ID:</strong> {chainId}</p>
        <p><strong>Token Address:</strong> {tokenAddress}</p>
        <p><strong>Type:</strong> {tokenProfile?.type}</p>
        <p><strong>Status:</strong> {tokenProfile?.status}</p>
        <p><strong>Payment Timestamp:</strong> {tokenProfile?.paymentTimestamp}</p>
      </div>
    );
  };

  return (
    <div className="pb-16 bg-primary">
      <Header />
      <div className='rounded-t-3xl pt-6 bg-white mt-4 px-4'>
        {renderContent()}
      </div>
    </div>
  );
};

export default TokenDetails;
