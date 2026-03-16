import api from "./axios";

export const createPayment = async (orderIds) => {
  const res = await api.post("/payments", { orderIds });
  return res.data;
};