import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import { useTonConnect } from '@tonconnect/ui-react';
import { Buffer } from 'buffer';

// Polyfill Buffer for the browser environment
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}

export const getBaseBalance = async (address) => {
  if (typeof window !== 'undefined') {
    const provider = new ethers.providers.JsonRpcProvider('https://mainnet.base.org');
    const balance = await provider.getBalance(address);
    return ethers.utils.formatEther(balance);
  }
};

export const getSolanaBalance = async (address) => {
  if (typeof window !== 'undefined') {
    const connection = new Connection('https://api.mainnet-beta.solana.com');
    const publicKey = new PublicKey(address);
    const balance = await connection.getBalance(publicKey);
    return balance / 1e9; // Convert lamports to SOL
  }
};

export const useTonBalance = () => {
  const { balance } = useTonConnect();
  return balance ? balance / 1e9 : 0; // Convert nanotons to TON
};
