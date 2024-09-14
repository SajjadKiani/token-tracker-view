import React, { useState, useEffect } from 'react';
import CryptoCard from '../components/CryptoCard';

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const loadBookmarks = () => {
      const savedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
      setBookmarks(savedBookmarks);
    };

    loadBookmarks();
    window.addEventListener('storage', loadBookmarks);

    return () => {
      window.removeEventListener('storage', loadBookmarks);
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Bookmarks</h1>
      {bookmarks.length === 0 ? (
        <p>You haven't bookmarked any cryptocurrencies yet.</p>
      ) : (
        <div className="space-y-4">
          {bookmarks.map((crypto, index) => (
            <CryptoCard key={index} crypto={crypto} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmark;
