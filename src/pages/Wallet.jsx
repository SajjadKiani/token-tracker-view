import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { ethers } from 'ethers';

const Wallet = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethProvider);
    }
  }, []);

  const connectWallet = async () => {
    if (provider) {
      try {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      console.error("Ethereum provider not found");
    }
  };

  const fetchAssets = async () => {
    if (!account) return [];
    const balance = await provider.getBalance(account);
    return [
      {
        symbol: 'ETH',
        balance: ethers.utils.formatEther(balance),
      },
    ];
  };

  const { data: assets, isLoading, error } = useQuery({
    queryKey: ['assets', account],
    queryFn: fetchAssets,
    enabled: !!account,
  });

  return (
    <div className="bg-primary">
      <Header />
      <div className='rounded-t-3xl pt-6 bg-background mt-4 px-4'>
        <h2 className="text-2xl font-bold mb-4">Wallet</h2>
        {!account ? (
          <Button onClick={connectWallet}>Connect Wallet</Button>
        ) : (
          <div>
            <p className="mb-4">Connected: {account}</p>
            <h3 className="text-xl font-semibold mb-2">Assets</h3>
            {isLoading ? (
              <Loader className="animate-spin text-primary w-8 h-8" />
            ) : error ? (
              <p className="text-red-500">Error loading assets</p>
            ) : (
              <ul>
                {assets.map((asset, index) => (
                  <li key={index} className="mb-2">
                    {asset.symbol}: {asset.balance}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wallet;