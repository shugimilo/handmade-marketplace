import api from "./axios";

export const getAdminUsers = async (page = 1, limit = 20) => {
  const res = await api.get(`/users?page=${page}&limit=${limit}`);
  return res.data;
};

export const deleteAdminUser = async (userId) => {
  const res = await api.delete(`/users/${userId}`);
  return res.data;
};

export const getAdminItems = async (page = 1, limit = 20) => {
  const res = await api.get(`/items?page=${page}&limit=${limit}`);
  return res.data;
};

export const deleteAdminItem = async (itemId) => {
  const res = await api.delete(`/items/${itemId}`);
  return res.data;
};

export const getAdminOrders = async (page = 1, limit = 20) => {
  const res = await api.get(`/orders?page=${page}&limit=${limit}`);
  return res.data;
};

export const getAdminReviews = async (page = 1, limit = 20) => {
  const res = await api.get(`/reviews?page=${page}&limit=${limit}`);
  return res.data;
};