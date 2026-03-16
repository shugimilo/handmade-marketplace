import api from "./axios";

export const addFavorite = async (itemId) => {
  const res = await api.post(`/favorites/${itemId}`);
  return res.data;
};

export const removeFavorite = async (itemId) => {
  const res = await api.delete(`/favorites/${itemId}`);
  return res.data;
};