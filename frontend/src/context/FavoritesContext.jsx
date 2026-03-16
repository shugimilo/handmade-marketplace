import { createContext, useContext, useEffect, useState } from "react";
import { addFavorite, removeFavorite } from "../api/favoritesApi";
import { getCurrentUser } from "../api/usersApi";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { token } = useAuth();
  const [favoriteItemIds, setFavoriteItemIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = async () => {
    if (!token) {
      setFavoriteItemIds([]);
      return;
    }

    try {
      setLoading(true);
      const data = await getCurrentUser();
      const favorites = data.user?.favorites || [];
      setFavoriteItemIds(favorites.map((fav) => fav.itemId));
    } catch (err) {
      console.error("Failed to fetch favorites:", err);
      setFavoriteItemIds([]);
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (itemId) => favoriteItemIds.includes(itemId);

  const toggleFavorite = async (itemId) => {
    if (!token) return false;

    try {
      if (isFavorite(itemId)) {
        await removeFavorite(itemId);
        setFavoriteItemIds((prev) => prev.filter((id) => id !== itemId));
      } else {
        await addFavorite(itemId);
        setFavoriteItemIds((prev) => [...prev, itemId]);
      }
      return true;
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [token]);

  return (
    <FavoritesContext.Provider
      value={{
        favoriteItemIds,
        loading,
        isFavorite,
        toggleFavorite,
        fetchFavorites
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};