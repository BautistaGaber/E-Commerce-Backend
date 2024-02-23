
import { Router } from "express";
import { ProductController } from "../controller/product.controller.js";
import { validateAdminRole } from "../utils.js";


const router = Router();

router.get("/", ProductController.getProducts);

router.get("/:pid", ProductController.getProductById);

router.post("/", validateAdminRole, ProductController.addProduct);

router.put("/:pid",validateAdminRole, ProductController.updateProduct);

router.delete("/:pid",validateAdminRole, ProductController.deleteProduct);

export { router as productsRouter };
