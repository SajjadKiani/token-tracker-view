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
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('UserBookmarks')
        .select('bookmarks')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        console.error('Error fetching bookmarks:', error);
        return;
      }

      const bookmarks = data?.bookmarks || [];
      setIsBookmarked(bookmarks.some(bookmark => bookmark.tokenAddress === crypto.tokenAddress));
    };

    checkBookmarkStatus();
  }, [crypto.tokenAddress, session?.user]);

  const toggleBookmark = async () => {
    if (!session?.user) {
      toast({
        title: "Authentication required",
        description: "Please log in to bookmark cryptocurrencies.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('UserBookmarks')
        .select('bookmarks')
        .eq('user_id', session.user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      let bookmarks = data?.bookmarks || [];
      const index = bookmarks.findIndex(bookmark => bookmark.tokenAddress === crypto.tokenAddress);

      if (index === -1) {
        bookmarks.push(crypto);
        setIsBookmarked(true);
        toast({
          title: "Bookmark added",
          description: `${crypto.tokenAddress} has been bookmarked.`,
        });
      } else {
        bookmarks.splice(index, 1);
        setIsBookmarked(false);
        toast({
          title: "Bookmark removed",
          description: `${crypto.tokenAddress} has been removed from bookmarks.`,
        });
      }

      const { error: upsertError } = await supabase
        .from('UserBookmarks')
        .upsert({ user_id: session.user.id, bookmarks }, { onConflict: 'user_id' });

      if (upsertError) {
        throw upsertError;
      }

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
