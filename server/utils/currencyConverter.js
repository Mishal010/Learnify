// Currency Converter Utility
// Using exchangerate-api.com (free tier available)

const EXCHANGE_RATES = {
  INR: 1,
  USD: 0.012,
  EUR: 0.011,
  GBP: 0.0095,
  AUD: 0.018,
  CAD: 0.017,
  SGD: 0.016,
  AED: 0.044,
  SAR: 0.045,
};

// Convert price from INR to target currency
export const convertCurrency = (priceInINR, targetCurrency = "INR") => {
  if (!EXCHANGE_RATES[targetCurrency]) {
    return priceInINR; // Default to INR if currency not found
  }

  const convertedPrice = priceInINR * EXCHANGE_RATES[targetCurrency];
  return Math.round(convertedPrice * 100) / 100; // Round to 2 decimals
};

// Get all supported currencies
export const getSupportedCurrencies = () => {
  return Object.keys(EXCHANGE_RATES).map((code) => ({
    code,
    symbol: getCurrencySymbol(code),
    name: getCurrencyName(code),
  }));
};

// Get currency symbol
export const getCurrencySymbol = (currencyCode) => {
  const symbols = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
    AUD: "A$",
    CAD: "C$",
    SGD: "S$",
    AED: "د.إ",
    SAR: "﷼",
  };
  return symbols[currencyCode] || currencyCode;
};

// Get currency name
export const getCurrencyName = (currencyCode) => {
  const names = {
    INR: "Indian Rupee",
    USD: "US Dollar",
    EUR: "Euro",
    GBP: "British Pound",
    AUD: "Australian Dollar",
    CAD: "Canadian Dollar",
    SGD: "Singapore Dollar",
    AED: "UAE Dirham",
    SAR: "Saudi Riyal",
  };
  return names[currencyCode] || currencyCode;
};

// Format price with currency
export const formatPrice = (price, currencyCode = "INR") => {
  const symbol = getCurrencySymbol(currencyCode);
  return `${symbol}${price.toFixed(2)}`;
};
