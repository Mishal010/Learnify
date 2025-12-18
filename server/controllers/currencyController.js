import {
  convertCurrency,
  getSupportedCurrencies,
  getCurrencySymbol,
  formatPrice,
} from "../utils/currencyConverter.js";

// Get all supported currencies
export const getCurrencies = async (req, res) => {
  try {
    const currencies = getSupportedCurrencies();
    res.status(200).json({
      success: true,
      currencies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch currencies",
    });
  }
};

// Convert price
export const convertPrice = async (req, res) => {
  try {
    const { priceInINR, targetCurrency = "INR" } = req.body;

    if (!priceInINR || priceInINR < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid price is required",
      });
    }

    const convertedPrice = convertCurrency(priceInINR, targetCurrency);
    const symbol = getCurrencySymbol(targetCurrency);
    const formatted = formatPrice(convertedPrice, targetCurrency);

    res.status(200).json({
      success: true,
      originalPrice: priceInINR,
      convertedPrice,
      currency: targetCurrency,
      symbol,
      formatted,
    });
  } catch (error) {
    console.error("Price conversion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to convert price",
    });
  }
};

// Convert multiple prices (for cart)
export const convertCartPrices = async (req, res) => {
  try {
    const { items, targetCurrency = "INR" } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Items must be an array",
      });
    }

    const convertedItems = items.map((item) => ({
      ...item,
      originalPrice: item.price,
      convertedPrice: convertCurrency(item.price, targetCurrency),
      currency: targetCurrency,
      symbol: getCurrencySymbol(targetCurrency),
    }));

    const totalINR = items.reduce((sum, item) => sum + item.price, 0);
    const totalConverted = convertedItems.reduce(
      (sum, item) => sum + item.convertedPrice,
      0
    );

    res.status(200).json({
      success: true,
      items: convertedItems,
      totals: {
        inINR: totalINR,
        converted: totalConverted,
        currency: targetCurrency,
        symbol: getCurrencySymbol(targetCurrency),
        formatted: formatPrice(totalConverted, targetCurrency),
      },
    });
  } catch (error) {
    console.error("Cart conversion error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to convert cart prices",
    });
  }
};
