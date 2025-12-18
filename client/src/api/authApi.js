import axiosInstance from "./axiosClient";

export const refreshAccessToken = async () => {
  const response = await axiosInstance.post("/auth/refresh");
  return response.data;
};

export const loginApi = async ({ email, password }) => {
  const response = await axiosInstance.post("/auth/login", { email, password });
  console.log(response);
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
  const response = await axiosInstance.post("/auth/request-reset", { email });
  return response.data;
};

export const resetPasswordApi = async ({ token, newPassword }) => {
  const response = await axiosInstance.post(`/auth/reset-password/${token}`, {
    newPassword,
  });
  return response.data;
};
