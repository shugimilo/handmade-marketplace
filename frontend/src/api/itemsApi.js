import api from "./axios";

export const getItems = async (page = 1, limit = 10) => {
  const res = await api.get(`/items?page=${page}&limit=${limit}`);
  return res.data;
};

export const getItemById = async (id) => {
  const res = await api.get(`/items/${id}`);
  return res.data;
};

export const createItem = async (itemData) => {
  const res = await api.post("/items", itemData);
  return res.data;
};

export const uploadItemImage = async (itemId, imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await api.post(`/items/${itemId}/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return res.data;
};