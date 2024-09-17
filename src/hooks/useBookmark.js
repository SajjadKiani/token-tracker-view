import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/supabase';
import { useSupabaseAuth } from '../integrations/supabase';
import { useToast } from "@/components/ui/use-toast";

export const useBookmark = (crypto) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { session } = useSupabaseAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!session || !crypto.tokenAddress) return;

      try {
        const { data, error } = await supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('token_address', crypto.tokenAddress)
          .single();

        if (error) {
          if (error.code === '42P01') {
            console.error('Bookmarks table does not exist. Please create it in your Supabase project.');
            toast({
              title: "Database Error",
              description: "The bookmarks feature is currently unavailable. Please try again later.",
              variant: "destructive",
            });
          } else {
            console.error('Error checking bookmark status:', error);
          }
          return;
        }

        setIsBookmarked(!!data);
      } catch (error) {
        console.error('Error in checkBookmarkStatus:', error);
      }
    };

    checkBookmarkStatus();
  }, [crypto.tokenAddress, session, toast]);

  const toggleBookmark = async (crypto) => {
    if (!session) return;

    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', session.user.id)
          .eq('token_address', crypto.tokenAddress);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: session.user.id,
            token_address: crypto.tokenAddress,
            chain_id: crypto.chainId,
            token_data: crypto
          });

        if (error) throw error;
      }

      setIsBookmarked(!isBookmarked);
      toast({
        title: isBookmarked ? "Bookmark Removed" : "Bookmark Added",
        description: `${crypto.tokenAddress} has been ${isBookmarked ? 'removed from' : 'added to'} your bookmarks.`,
      });
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { isBookmarked, toggleBookmark };
};
