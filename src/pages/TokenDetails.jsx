import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Copy, Loader } from 'lucide-react';
import Header from '../components/Header';
import moment from 'moment';
import { Button } from '@/components/ui/button';

const TokenDetails = () => {
  const { chainId, tokenAddress } = useParams();
  const [btnText, setBtnText] = useState('Copy Token Address');
  const chartContainerRef = useRef(null);
  const [chartError, setChartError] = useState(null);

  useEffect(() => {
    const loadTradingViewScript = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/tv.js';
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    const initChart = () => {
      if (typeof TradingView !== 'undefined' && chartContainerRef.current) {
        new TradingView.widget({
          width: '100%',
          height: 400,
          symbol: 'BINANCE:BTCUSDT', // Default symbol, we'll update this later
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: chartContainerRef.current.id
        });
      } else {
        setChartError('Failed to load TradingView chart');
      }
    };

    loadTradingViewScript()
      .then(initChart)
      .catch((error) => {
        console.error('Error loading TradingView script:', error);
        setChartError('Failed to load TradingView chart');
      });

    return () => {
      // Cleanup if needed
    };
  }, []);

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
    setBtnText('Copied!');
    navigator.clipboard.writeText(tokenAddress);
    setTimeout(() => setBtnText('Copy Token Address'), 2000);
  };

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
        <Button className='mt-5 flex items-center gap-1' onClick={handleCopy}>
          <Copy />
          {btnText}
        </Button>
        <div className="mt-6">
          {chartError ? (
            <div className="text-red-500">{chartError}</div>
          ) : (
            <div id="tradingview_chart" ref={chartContainerRef}></div>
          )}
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
