import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { refreshAccessToken } from "../api/authApi";

export const useAuth = () => {
  const {
    user,
    accessToken,
    isAuthenticated,
    authInitialized,
    setAuth,
    logout,
  } = useAuthStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await refreshAccessToken();

        if (data?.accessToken && data?.user) {
          setAuth(data.user, data.accessToken);
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    if (!authInitialized) {
      initAuth();
    } else {
      setLoading(false);
    }
  }, [authInitialized]);

  return { user, accessToken, isAuthenticated, loading };
};
