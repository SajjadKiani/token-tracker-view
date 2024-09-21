import { ethers } from 'ethers';
import { Connection, PublicKey } from '@solana/web3.js';
import { TonClient } from '@ton/ton';
import { Buffer } from 'buffer';

// Polyfill Buffer for the browser environment
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
}

export const getBaseBalance = async (address) => {
  const provider = new ethers.providers.JsonRpcProvider('https://mainnet.base.org');
  const balance = await provider.getBalance(address);
  return ethers.utils.formatEther(balance);
};

export const getSolanaBalance = async (address) => {
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  const publicKey = new PublicKey(address);
  const balance = await connection.getBalance(publicKey);
  return balance / 1e9; // Convert lamports to SOL
};

export const getTonBalance = async (address) => {
  const client = new TonClient({
    endpoint: 'https://toncenter.com/api/v2/jsonRPC',
  });
  const balance = await client.getBalance(address);
  return balance / 1e9; // Convert nanotons to TON
};
