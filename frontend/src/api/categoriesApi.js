import api from "./axios";

export const getCategories = async () => {
  const res = await api.get("/categories");
  return res.data;
};

export const getCategoryItems = async (
  categoryId,
  page = 1,
  limit = 12,
  sort = "newest"
) => {
  const res = await api.get(`/categories/${categoryId}/items`, {
    params: {
      page,
      limit,
      sort
    }
  });

  return res.data;
};