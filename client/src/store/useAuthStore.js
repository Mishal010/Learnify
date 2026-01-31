// import { create } from "zustand"

// export const useAuthStore = create((set) => ({
//     user: null,
//     isAuthenticated: false,
//     accessToken: null,

//     // setAccessToken: (token) => set(() => ({ accessToken: token, isAuthenticated: !!token })),
//     setAuth: (user, token) =>
//         set(() => {
//             if (!token) {
//                 return { user: null, accessToken: null, isAuthenticated: false };
//             }
//             return {
//                 user,
//                 accessToken: token,
//                 isAuthenticated: true,
//             };
//         })
//     ,
//     logout: () => set(() => ({ accessToken: null, user: null, isAuthenticated: false }))
// }))

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export const useAuthStore = create(
  devtools((set) => ({
    user: null,
    accessToken: null,

    // 🔑 NEW
    isAuthenticated: false,
    authInitialized: false,

    /* ================= SET AUTH ================= */
    setAuth: (user, token) =>
      set(
        () => ({
          user,
          accessToken: token,
          isAuthenticated: true,
          authInitialized: true,
        }),
        false,
        "auth/setAuth"
      ),

    /* ================= LOGOUT ================= */
    logout: () =>
      set(
        () => ({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          authInitialized: true,
        }),
        false,
        "auth/logout"
      ),
  }))
);
