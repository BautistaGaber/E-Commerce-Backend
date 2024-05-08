import { Router } from "express";
import { CartController } from "../controller/cart.controller.js";
import { validateUserRole } from "../utils.js";

const router = Router();

router.get("/", CartController.getUserCart);

router.get("/:cid", CartController.getCartById);

router.post("/", CartController.addCart);

router.post("/:cid/products/:pid", validateUserRole, CartController.addProdToCart);

router.post("/purchase", CartController.addPurchase);

router.put("/:cid", CartController.updateCart);

router.put("/:cid/products/:pid", CartController.updateProdToCart);

router.delete("/:cid", CartController.deleteCart);

router.delete("/:cid/products/:pid", CartController.deleteProdToCart);

export { router as cartsRouter };
