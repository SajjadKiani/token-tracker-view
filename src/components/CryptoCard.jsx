import React from 'react';

const CryptoCard = ({ crypto }) => {
  if (!crypto) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center mb-2">
        {crypto.icon && (
          <img src={crypto.icon} alt={crypto.header} className="w-10 h-10 mr-2 rounded-full" />
        )}
        <h2 className="text-lg font-semibold">{crypto.header || 'Unknown'}</h2>
      </div>
      {crypto.description && (
        <p className="text-sm text-gray-600 mb-2">{crypto.description}</p>
      )}
      <div className="text-xs text-gray-500">
        {crypto.chainId && <p>Chain ID: {crypto.chainId}</p>}
        {crypto.tokenAddress && <p>Token Address: {crypto.tokenAddress}</p>}
        {crypto.amount !== undefined && <p>Amount: {crypto.amount}</p>}
        {crypto.totalAmount !== undefined && <p>Total Amount: {crypto.totalAmount}</p>}
      </div>
      {crypto.links && crypto.links.length > 0 && (
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
      )}
    </div>
  );
};

export default CryptoCard;
