import api from "./axios";

export const getShippingAddresses = async () => {
  const res = await api.get("/shipping-addresses");
  return res.data;
};

export const createShippingAddress = async (addressData) => {
  const res = await api.post("/shipping-addresses", addressData);
  return res.data;
};