import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { refreshAccessToken } from "../api/authApi";
export const useAuth = () => {
  const { user, accessToken, isAuthenticated, setAuth, logout } =
    useAuthStore();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const data = await refreshAccessToken();

        if (data?.accessToken && data?.user) {
          setAuth(data?.user, data?.accessToken);
        } else {
          logout();
        }
      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { user, accessToken, isAuthenticated, loading };
};
