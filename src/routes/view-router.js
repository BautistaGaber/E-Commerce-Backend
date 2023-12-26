import { Router } from "express";
import productModel from "../dao//fileSystem/mongodb/models/product.model.js";
import socketServer from "../app.js";

const router = Router();

router.get("/home", async (req, res) => {
  const products = await productModel.find();
  res.render("home", { products });
});

router.get("/realTimeProducts", async (req, res) => {
  res.render("realTimeProducts", {});
});

export { router as viewRouter };
