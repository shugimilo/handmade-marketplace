import api from "./axios";

export const getBuyerOrders = async () => {
  const res = await api.get("/orders/buyer");
  return res.data;
};

export const getSellerOrders = async () => {
  const res = await api.get("/orders/seller");
  return res.data;
};

export const createOrder = async (addressId) => {
  const res = await api.post("/orders", { addressId });
  return res.data;
};