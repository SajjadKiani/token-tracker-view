import { useState, useEffect } from 'react';

export const useBookmark = (crypto) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setIsBookmarked(bookmarks.some(bookmark => bookmark.tokenAddress === crypto.tokenAddress));
  }, [crypto.tokenAddress]);

  const toggleBookmark = (crypto) => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    const index = bookmarks.findIndex(bookmark => bookmark.tokenAddress === crypto.tokenAddress);

    if (index === -1) {
      bookmarks.push(crypto);
      setIsBookmarked(true);
    } else {
      bookmarks.splice(index, 1);
      setIsBookmarked(false);
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  };

  return { isBookmarked, toggleBookmark };
};