import { Router } from "express";
import { generateFakeProduct } from "../utils.js";

const router = Router();

router.get("/mockProducts", (req, res) => {
  let mockArrayProduct = [];
  for (let i = 0; i < 100; i++) {
    const prod = generateFakeProduct();
    mockArrayProduct.push(prod);
  }

  res.status(200).json({ status: "success", products: mockArrayProduct });
});

export { router as mockRouter };