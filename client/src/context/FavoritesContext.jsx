import { createContext, useContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector((state) => state.user);

  const fetchUserFavorites = async () => {
    try {
      if (currentUser) {
        const res = await fetch(`/api/favorite/my-favorites/${currentUser._id}`);
        if (res.ok) {
          const data = await res.json();
          setFavorites(data);
        }
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserFavorites();
  }, [currentUser]);

  const toggleFavorite = async (listing) => {
    if (!currentUser) {
      return; // Only allow favorites for logged-in users
    }

    try {
      const isFav = favorites.some(fav => fav._id === listing._id);
      const endpoint = isFav ? 'remove' : 'add';
      
      const res = await fetch(`/api/favorite/${endpoint}/${listing._id}`, {
        method: isFav ? 'DELETE' : 'POST',
        credentials: 'include'
      });

      if (res.ok) {
        // Refresh favorites after successful toggle
        fetchUserFavorites();
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const isFavorite = (listingId) => {
    return favorites.some(fav => fav._id === listingId);
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      toggleFavorite, 
      isFavorite,
      loading 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};