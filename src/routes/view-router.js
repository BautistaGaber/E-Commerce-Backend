import { Router } from "express";
import { ViewsRouterController } from "../controller/views-router.controller.js";

const router = Router();

router.get("/home", ViewsRouterController.getProducts);

router.get("/realTimeProducts", ViewsRouterController.getRealTimeProducts);

router.get("/carts/:cid", ViewsRouterController.getCartById);

router.get("/products", ViewsRouterController.getProductWithPaginate); 

router.get("/users/register", ViewsRouterController.getUsersRegister);

router.get("/users/login", ViewsRouterController.getUsersLogin);

router.get("/users", ViewsRouterController.getUsers);

router.post("/products/addToCart", ViewsRouterController.addProductToCart);

export { router as viewRouter };
