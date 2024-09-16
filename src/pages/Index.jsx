import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import CryptoCard from '../components/CryptoCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from 'lucide-react';
import Header from '../components/Header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("main");
  const [selectedChainId, setSelectedChainId] = useState("all");

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

  const chainIds = useMemo(() => {
    const allData = [...(mainData || []), ...(boostedData || []), ...(topBoostsData || [])];
    const uniqueChainIds = [...new Set(allData.map(item => item.chainId))];
    return uniqueChainIds.sort();
  }, [mainData, boostedData, topBoostsData]);

  const filterDataByChainId = (data) => {
    if (selectedChainId === "all") return data;
    return data.filter(item => item.chainId === selectedChainId);
  };

  const renderContent = (data, isLoading, error) => {
    if (isLoading) return <div className="flex justify-center items-center h-40">
      <Loader className='animate-spin text-primary w-8 h-8' />
    </div>;
    if (error) return <div className="flex justify-center items-center h-40">Error: {error.message}</div>;
    if (!Array.isArray(data) || data.length === 0) return <p className="text-center">No data available</p>;

    const filteredData = filterDataByChainId(data);

    return (
      <div className="space-y-4">
        {filteredData.map((item, index) => (
          <CryptoCard key={index} crypto={item} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-primary">
      <Header />
      <div className='rounded-t-3xl pt-6 bg-background shadow-t-xl mt-4 px-4'>
        <div className="mb-4">
          <Select value={selectedChainId} onValueChange={setSelectedChainId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by Chain ID" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Chains</SelectItem>
              {chainIds.map((chainId) => (
                <SelectItem key={chainId} value={chainId}>
                  {chainId}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
    </div>
  );
};

export default Index;
