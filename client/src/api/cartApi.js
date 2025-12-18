import axiosInstance from "./axiosClient";

export const addToCartApi = async ({ courseId }) => {
  const response = await axiosInstance.patch(`/cart/${courseId}`);
  return response.data;
};

export const getCartApi = async () => {
  const response = await axiosInstance.get(`cart`);
  return response.data;
};

export const removeFromCartApi = async ({ courseId }) => {
  const response = await axiosInstance.delete(`/cart/${courseId}`);
  return response.data;
};

export const createCheckoutSessionApi = async (products) => {
  const response = await axiosInstance.post(
    `/payment/create-checkout-session`,
    { products }
  );
  return response.data;
};

export const getPaymentHistoryApi = async () => {
  const response = await axiosInstance.get(`/payment/history`);
  return response.data;
};
