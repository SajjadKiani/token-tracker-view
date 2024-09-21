import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import { TonConnectUI } from '@tonconnect/ui-react';
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

export const getTonBalance = async () => {
  const tonConnectUI = new TonConnectUI();
  const wallet = tonConnectUI.wallet;
  if (wallet) {
    return wallet.balance ? Number(wallet.balance) / 1e9 : 0; // Convert nanotons to TON
  }
  return 0;
};
