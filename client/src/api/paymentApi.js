import axiosInstance from "./axiosClient";

export const getAllPaymentsApi = async ({ page = 1, limit = 12, status = "" }) => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (status) params.set("status", status);

  const response = await axiosInstance.get(`/payment/all?${params.toString()}`);
  return response.data;
};

export const getPaymentHistoryApi = async () => {
  const response = await axiosInstance.get(`/payment/history`);
  return response.data;
};
