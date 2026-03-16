import api from "./axios";

export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

export const getCategoryItems = async (categoryId) => {
  const res = await api.get(`/categories/${categoryId}/items`);
  return res.data;
};