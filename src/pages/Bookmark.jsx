import React from 'react';
import { useQuery } from '@tanstack/react-query';
import CryptoCard from '../components/CryptoCard';
import Header from '../components/Header';
import { supabase } from '../integrations/supabase/supabase';
import { useSupabaseAuth } from '../integrations/supabase';
import { Loader } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

const Bookmark = () => {
  const { session } = useSupabaseAuth();
  const { toast } = useToast();

  const fetchBookmarks = async () => {
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }
    const { data, error } = await supabase
      .from('bookmarks')
      .select('*')
      .eq('user_id', session.user.id);

    if (error) throw error;
    return data;
  };

  const { data: bookmarks, isLoading, error } = useQuery({
    queryKey: ['bookmarks', session?.user?.id],
    queryFn: fetchBookmarks,
    enabled: !!session?.user?.id,
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to fetch bookmarks: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  if (!session) {
    return (
      <div className="bg-primary">
        <Header />
        <div className='rounded-t-3xl pt-6 bg-background mt-4 px-4'>
          <p>Please log in to view your bookmarks.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-primary">
        <Header />
        <div className='rounded-t-3xl pt-6 bg-background mt-4 px-4 flex justify-center items-center h-40'>
          <Loader className="animate-spin text-primary w-8 h-8" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-primary">
        <Header />
        <div className='rounded-t-3xl pt-6 bg-background mt-4 px-4'>
          <p className="text-red-500">Error loading bookmarks: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-primary">
      <Header />
      <div className='rounded-t-3xl pt-6 bg-background mt-4 px-4'>
        {bookmarks && bookmarks.length === 0 ? (
          <p>You haven't bookmarked any cryptocurrencies yet.</p>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((bookmark, index) => (
              <CryptoCard key={index} crypto={bookmark.token_data} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmark;
