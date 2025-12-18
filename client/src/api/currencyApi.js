import axiosInstance from "./axiosClient";

// Get all supported currencies
export const getCurrenciesApi = async () => {
  try {
    const response = await axiosInstance.get("/currency/currencies");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch currencies:", error);
    throw error;
  }
};

// Convert single price
export const convertPriceApi = async (priceInINR, targetCurrency) => {
  try {
    const response = await axiosInstance.post("/currency/convert", {
      priceInINR,
      targetCurrency,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to convert price:", error);
    throw error;
  }
};

// Convert cart prices
export const convertCartPricesApi = async (items, targetCurrency) => {
  try {
    const response = await axiosInstance.post("/currency/convert-cart", {
      items,
      targetCurrency,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to convert cart prices:", error);
    throw error;
  }
};
