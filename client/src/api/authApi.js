import axiosInstance from "./axiosClient";
import axiosPublic from "./axiosPublic";
import refreshClient from "./refreshClient";

/* ================= REFRESH ================= */
export const refreshAccessToken = async () => {
  const response = await refreshClient.post("/auth/refresh");
  return response.data;
};

/* ================= AUTH ================= */
export const loginApi = async ({ email, password }) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  return response.data;
};

export const registerApi = async ({ name, email, password, role }) => {
  const response = await axiosInstance.post("/auth/register", {
    name,
    email,
    password,
    role,
  });
  return response.data;
};

export const logoutApi = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const forgotPasswordApi = async ({ email }) => {
  const response = await axiosPublic.post("/auth/request-reset", { email });
  return response.data;
};

export const resetPasswordApi = async ({ token, newPassword }) => {
  const response = await axiosPublic.post(`/auth/reset-password/${token}`, {
    newPassword,
  });
  return response.data;
};
