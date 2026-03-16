import api from "./axios";

export const searchAll = async (query, page = 1, limit = 5) => {
  const res = await api.get(`/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  return res.data;
};