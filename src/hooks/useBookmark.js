import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/supabase';
import { useSupabaseAuth } from '../integrations/supabase';

export const useBookmark = (crypto) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { session } = useSupabaseAuth();

  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (!session || !crypto.tokenAddress) return;

      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('token_address', crypto.tokenAddress)
        .single();

      if (error) {
        console.error('Error checking bookmark status:', error);
        return;
      }

      setIsBookmarked(!!data);
    };

    checkBookmarkStatus();
  }, [crypto.tokenAddress, session]);

  const toggleBookmark = async (crypto) => {
    if (!session) return;

    if (isBookmarked) {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', session.user.id)
        .eq('token_address', crypto.tokenAddress);

      if (error) {
        console.error('Error removing bookmark:', error);
        return;
      }
    } else {
      const { error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: session.user.id,
          token_address: crypto.tokenAddress,
          chain_id: crypto.chainId,
          token_data: crypto
        });

      if (error) {
        console.error('Error adding bookmark:', error);
        return;
      }
    }

    setIsBookmarked(!isBookmarked);
  };

  return { isBookmarked, toggleBookmark };
};
