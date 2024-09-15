import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';

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

  if (isLoading) return <div className="flex justify-center items-center h-screen"><Loader className="animate-spin text-primary w-8 h-8" /></div>;
  if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

  const tokenProfile = data?.[0];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Token Details</h1>
      <div className="bg-white rounded-lg shadow-sm p-4">
        <p><strong>Chain ID:</strong> {chainId}</p>
        <p><strong>Token Address:</strong> {tokenAddress}</p>
        <p><strong>Type:</strong> {tokenProfile?.type}</p>
        <p><strong>Status:</strong> {tokenProfile?.status}</p>
        <p><strong>Payment Timestamp:</strong> {tokenProfile?.paymentTimestamp}</p>
      </div>
    </div>
  );
};

export default TokenDetails;