import express from "express";
import {
  getCurrencies,
  convertPrice,
  convertCartPrices,
} from "../controllers/currencyController.js";

const router = express.Router();

// Get all supported currencies
router.get("/currencies", getCurrencies);

// Convert single price
router.post("/convert", convertPrice);

// Convert cart prices
router.post("/convert-cart", convertCartPrices);

export default router;
