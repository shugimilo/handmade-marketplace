import api from "./axios";

export const getItems = async (page = 1, limit = 10) => {
  const res = await api.get(`/items?page=${page}&limit=${limit}`);
  return res.data;
};

export const getItemById = async (id) => {
  const res = await api.get(`/items/${id}`);
  return res.data;
};