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

export const updateOrderStatus = async (orderId, status) => {
  const res = await api.patch(`/orders/${orderId}/status`, { status });
  return res.data;
};