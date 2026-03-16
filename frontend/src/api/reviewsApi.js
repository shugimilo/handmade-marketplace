import api from "./axios";

export const createReview = async (itemId, reviewData) => {
  const res = await api.post(`/items/${itemId}/reviews`, reviewData);
  return res.data;
};