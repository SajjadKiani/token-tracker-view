import React, { useState, useEffect } from 'react';
import CryptoCard from '../components/CryptoCard';
import Header from '../components/Header';

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
    <div className="pb-16 bg-primary">
      <Header />
      <div className='rounded-t-3xl pt-6 bg-white mt-4 px-4'>
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
    </div>
  );
};

export default Bookmark;
