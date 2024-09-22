import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Header from '../components/Header';
import { Button } from '@/components/ui/button';
import { Copy, Loader, LogOut, Unplug } from 'lucide-react';
import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import { TonConnectButton, useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { getBaseBalance, getSolanaBalance, getTonBalance } from '../utils/chainUtils';
import { Badge } from '@/components/ui/badge';

const Wallet = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainType, setChainType] = useState(null);
  const tonWallet = useTonWallet();
  const [tonConnectUI, setOptions] = useTonConnectUI();

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

  const formatNumber = (value) => {
    return value ? value.toLocaleString() : 'N/A';
  };

  return (
      <div className='mt-6'>
        {tonWallet &&
        <Button onClick={() => tonConnectUI.disconnect()} size='icon'>
          <Unplug />
        </Button>
        }
        {
          tonWallet && <h1 className='font-extrabold text-5xl text-center'>${formatNumber(1200)}</h1>
        }
        {!account && !tonWallet ? (
          <div className="flex items-center gap-4 flex-wrap">
            <Button onClick={() => connectWallet('ethereum')}>Connect Ethereum Wallet</Button>
            <Button onClick={() => connectWallet('base')}>Connect Base Wallet</Button>
            <Button onClick={() => connectWallet('solana')}>Connect Solana Wallet</Button>
            <TonConnectButton />
          </div>
        ) : (
          <div className='flex flex-col items-center gap-4 mt-4'>
            {account && <p className="mb-4 truncate">Connected: {account}</p>}
            {tonWallet && <Badge variant={'secondary'}><p className="truncate text-center">{tonWallet.account.address.slice(0,10)}...</p> <Copy className='w-3 h-3 ml-1' /> </Badge>}
            {isLoading ? (
              <Loader className="animate-spin text-primary w-8 h-8" />
            ) : error ? (
              <p className="text-red-500 truncate w-full">Error loading assets. error: {error?.message}</p>
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
  );
};

export default Wallet;
