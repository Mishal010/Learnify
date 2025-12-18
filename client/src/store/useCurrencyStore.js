import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCurrencyStore = create(
  persist(
    (set) => ({
      currency: "INR", // Default currency
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: "currency-store", // Persist to localStorage
    }
  )
);
