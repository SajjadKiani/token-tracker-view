import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { getBaseBalance, getSolanaBalance, getTonBalance } from '../utils/chainUtils';

const Wallet = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainType, setChainType] = useState(null);
  const tonWallet = useTonWallet();

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
    }
    // TON connection is handled by TonConnectButton
  };

  const fetchAssets = async () => {
    if (!account && !tonWallet) return [];
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
    }

    if (tonWallet) {
      const tonBalance = await getTonBalance();
      assets.push({
        symbol: 'TON',
        balance: tonBalance,
      });
    }

    return assets;
  };

  const { data: assets, isLoading, error } = useQuery({
    queryKey: ['assets', account, chainType, tonWallet?.account.address],
    queryFn: fetchAssets,
    enabled: !!account || !!tonWallet,
  });

  useEffect(() => {
    console.log(assets);
    console.log(error?.message);
  }, [assets, error])

  return (
    <div className="bg-primary">
      <Header />
      <div className='rounded-t-3xl pt-6 bg-background mt-4 px-4'>
        {/* <h2 className="text-2xl font-bold mb-4">Wallet</h2> */}
        {!account && !tonWallet ? (
          <div className="flex items-center gap-4 flex-wrap">
            <Button onClick={() => connectWallet('ethereum')}>Connect Ethereum Wallet</Button>
            <Button onClick={() => connectWallet('base')}>Connect Base Wallet</Button>
            <Button onClick={() => connectWallet('solana')}>Connect Solana Wallet</Button>
            <TonConnectButton />
          </div>
        ) : (
          <div>
            {account && <p className="mb-4 truncate">Connected: {account}</p>}
            {tonWallet && <p className="mb-4 truncate">TON Wallet Connected: <br /> {tonWallet.account.address}</p>}
            <h3 className="text-xl font-semibold mb-2">Assets</h3>
            {isLoading ? (
              <Loader className="animate-spin text-primary w-8 h-8" />
            ) : error ? (
              <p className="text-red-500 truncate">Error loading assets. error: {error?.message}</p>
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
