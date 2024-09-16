import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Copy, Loader, Search } from 'lucide-react';
import Header from '../components/Header';
import moment from 'moment';
import { Button } from '@/components/ui/button';

const TokenDetails = () => {
  const { chainId, tokenAddress } = useParams();
  const [btnText, setBtnText] = useState('Copy Address')

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

  const handleCopy = () => {
    setBtnText('Copied!')
    navigator.clipboard.writeText(tokenAddress)
  }

  const renderContent = () => {
    if (isLoading) return <div className="flex justify-center items-center h-40"><Loader className="animate-spin text-primary w-8 h-8" /></div>;
    if (error) return <div className="p-4 text-red-500">Error: {error.message}</div>;

    const tokenProfile = data?.[0];

    return (
      <div className="bg-background rounded-lg shadow-sm p-4">
        <p><strong>Chain ID:</strong> {chainId}</p>
        <p className='break-words'><strong>Token Address:</strong> {tokenAddress}</p>
        <p><strong>Type:</strong> {tokenProfile?.type}</p>
        <p><strong>Status:</strong> {tokenProfile?.status}</p>
        <p><strong>Payment Timestamp:</strong> {moment(tokenProfile?.paymentTimestamp).fromNow()} </p>
        <div className='flex gap-3 mt-5'>
        <Button className='flex items-center gap-1'
          onClick={handleCopy}
        >
          <Copy />
          {btnText}
        </Button>

        <Button asChild>
          <Link to={'/search?q=' + tokenAddress} className='flex items-center gap-1'>
            <Search />
            Search
          </Link>
        </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-primary">
      <Header />
      <div className='rounded-t-3xl pt-6 bg-background mt-4 px-4'>
        {renderContent()}
      </div>
    </div>
  );
};

export default TokenDetails;
