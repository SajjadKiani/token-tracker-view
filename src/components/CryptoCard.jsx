import React from 'react';

const CryptoCard = ({ crypto }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center mb-2">
        <img src={crypto.icon} alt={crypto.header} className="w-10 h-10 mr-2 rounded-full" />
        <h2 className="text-lg font-semibold">{crypto.header}</h2>
      </div>
      <p className="text-sm text-gray-600 mb-2">{crypto.description}</p>
      <div className="text-xs text-gray-500">
        <p>Chain ID: {crypto.chainId}</p>
        <p>Token Address: {crypto.tokenAddress}</p>
      </div>
      <div className="mt-2">
        {crypto.links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            className="text-blue-500 text-sm mr-2 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
};

export default CryptoCard;