import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import { TonClient } from '@ton/ton';
import { getBaseBalance, getSolanaBalance, getTonBalance } from '../utils/chainUtils';

const Wallet = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainType, setChainType] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethProvider);
    }
  }, []);

  const connectWallet = async (type) => {
    setChainType(type);
    if (type === 'ethereum' || type === 'base') {
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
    } else if (type === 'solana') {
      if (window.solana) {
        try {
          await window.solana.connect();
          setAccount(window.solana.publicKey.toString());
        } catch (error) {
          console.error("Failed to connect Solana wallet:", error);
        }
      } else {
        console.error("Solana wallet not found");
      }
    } else if (type === 'ton') {
      if (window.ton) {
        try {
          await window.ton.send('ton_requestAccounts');
          const accounts = await window.ton.send('ton_requestAccounts');
          setAccount(accounts[0]);
        } catch (error) {
          console.error("Failed to connect TON wallet:", error);
        }
      } else {
        console.error("TON wallet not found");
      }
    }
  };

  const fetchAssets = async () => {
    if (!account) return [];
    let assets = [];

    if (chainType === 'ethereum') {
      const balance = await provider.getBalance(account);
      assets.push({
        symbol: 'ETH',
        balance: ethers.utils.formatEther(balance),
      });
    } else if (chainType === 'base') {
      const balance = await getBaseBalance(account);
      assets.push({
        symbol: 'ETH (Base)',
        balance: balance,
      });
    } else if (chainType === 'solana') {
      const balance = await getSolanaBalance(account);
      assets.push({
        symbol: 'SOL',
        balance: balance,
      });
    } else if (chainType === 'ton') {
      const balance = await getTonBalance(account);
      assets.push({
        symbol: 'TON',
        balance: balance,
      });
    }

    return assets;
  };

  const { data: assets, isLoading, error } = useQuery({
    queryKey: ['assets', account, chainType],
    queryFn: fetchAssets,
    enabled: !!account,
  });

  return (
    <div className="bg-primary">
      <Header />
      <div className='rounded-t-3xl pt-6 bg-background mt-4 px-4'>
        <h2 className="text-2xl font-bold mb-4">Wallet</h2>
        {!account ? (
          <div className="space-y-2">
            <Button onClick={() => connectWallet('ethereum')}>Connect Ethereum Wallet</Button>
            <Button onClick={() => connectWallet('base')}>Connect Base Wallet</Button>
            <Button onClick={() => connectWallet('solana')}>Connect Solana Wallet</Button>
            <Button onClick={() => connectWallet('ton')}>Connect TON Wallet</Button>
          </div>
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
