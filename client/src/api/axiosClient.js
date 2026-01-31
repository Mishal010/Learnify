import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";
import { refreshAccessToken } from "./authApi";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

/* ================= REQUEST ================= */
axiosInstance.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();

  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

/* ================= RESPONSE ================= */
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // ⛔ NEVER refresh on refresh endpoint
    if (originalRequest.url?.includes("/auth/refresh")) {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }

    const { isAuthenticated } = useAuthStore.getState();

    // ⛔ Do NOT refresh for guests (public APIs)
    if (!isAuthenticated) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const data = await refreshAccessToken();

        if (!data?.accessToken) {
          throw new Error("Refresh failed");
        }

        useAuthStore.getState().setAuth(data.user, data.accessToken);
        processQueue(null, data.accessToken);

        originalRequest.headers.Authorization =
          `Bearer ${data.accessToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        useAuthStore.getState().logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
