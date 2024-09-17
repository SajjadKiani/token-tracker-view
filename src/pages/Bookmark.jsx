import React from 'react';
import CryptoCard from '../components/CryptoCard';
import Header from '../components/Header';
import { useSupabaseAuth } from '../integrations/supabase';
import { supabase } from '../integrations/supabase/supabase';
import { useQuery } from '@tanstack/react-query';
import { Loader } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Bookmark = () => {
  const { session } = useSupabaseAuth();
  const { toast } = useToast();

  const fetchBookmarks = async () => {
    if (!session?.user?.id) {
      return [];
    }
    const { data, error } = await supabase
      .from('UserBookmarks')
      .select('bookmarks')
      .eq('user_id', session.user.id)
      .single();

    if (error) throw error;
    return data?.bookmarks || [];
  };

  const { data: bookmarks, isLoading, error } = useQuery({
    queryKey: ['bookmarks', session?.user?.id],
    queryFn: fetchBookmarks,
    enabled: !!session?.user?.id,
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to fetch bookmarks. Please try again.",
      variant: "destructive",
    });
  }

  return (
    <div className="bg-primary">
      <Header />
      <div className='rounded-t-3xl pt-6 bg-background mt-4 px-4'>
        {!session?.user ? (
          <p>Please log in to view your bookmarks.</p>
        ) : isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader className="animate-spin text-primary w-8 h-8" />
          </div>
        ) : bookmarks && bookmarks.length > 0 ? (
          <div className="space-y-4">
            {bookmarks.map((crypto, index) => (
              <CryptoCard key={index} crypto={crypto} />
            ))}
          </div>
        ) : (
          <p>You haven't bookmarked any cryptocurrencies yet.</p>
        )}
      </div>
    </div>
  );
};

export default Bookmark;
