
import { Router } from "express";
import { ProductController } from "../controller/product.controller.js";
import { validateAdminRole } from "../utils.js";
import { checkRol } from "../middlewares/auth.js";


const router = Router();

router.get("/", ProductController.getProducts);

router.get("/:pid", ProductController.getProductById);

router.post("/", checkRol(["admin", "premium"]), ProductController.addProduct);

router.put("/:pid",checkRol(["admin", "premium"]), ProductController.updateProduct);

router.delete("/:pid",checkRol(["admin", "premium"]), ProductController.deleteProduct);

export { router as productsRouter };
