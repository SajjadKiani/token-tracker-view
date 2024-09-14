import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CryptoCard from '../components/CryptoCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from 'lucide-react';

const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("main");

  const { data: mainData, isLoading: mainLoading, error: mainError } = useQuery({
    queryKey: ['mainData'],
    queryFn: () => fetchData('https://api.dexscreener.com/token-profiles/latest/v1'),
  });

  const { data: boostedData, isLoading: boostedLoading, error: boostedError } = useQuery({
    queryKey: ['boostedData'],
    queryFn: () => fetchData('https://api.dexscreener.com/token-boosts/latest/v1'),
  });

  const { data: topBoostsData, isLoading: topBoostsLoading, error: topBoostsError } = useQuery({
    queryKey: ['topBoostsData'],
    queryFn: () => fetchData('https://api.dexscreener.com/token-boosts/top/v1'),
  });

  const renderContent = (data, isLoading, error) => {
    if (isLoading) return <div className="flex justify-center items-center h-40">
      <Loader className=' animate-spin text-primary w-8 h-8' />
    </div>;
    if (error) return <div className="flex justify-center items-center h-40">Error: {error.message}</div>;
    if (!Array.isArray(data) || data.length === 0) return <p className="text-center">No data available</p>;

    return (
      <div className="space-y-4 px-4">
        {data.map((item, index) => (
          <CryptoCard key={index} crypto={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="pb-16">
      <h1 className="text-2xl font-bold text-center my-4">Crypto Tracker</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="main">Main</TabsTrigger>
          <TabsTrigger value="boosted">Boost</TabsTrigger>
          <TabsTrigger value="topBoosts">Active</TabsTrigger>
        </TabsList>
        <TabsContent value="main">
          {renderContent(mainData, mainLoading, mainError)}
        </TabsContent>
        <TabsContent value="boosted">
          {renderContent(boostedData, boostedLoading, boostedError)}
        </TabsContent>
        <TabsContent value="topBoosts">
          {renderContent(topBoostsData, topBoostsLoading, topBoostsError)}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
