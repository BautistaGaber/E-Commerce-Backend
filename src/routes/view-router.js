import { Router } from "express";
import { ViewsRouterController } from "../controller/views-router.controller.js";
import { verifyEmailTokenMW } from "../middlewares/auth.js";
import cartModel from "../dao/fileSystem/mongodb/models/cart.model.js";

const router = Router();

router.get("/home", ViewsRouterController.getProducts);

router.get("/realTimeProducts", ViewsRouterController.getRealTimeProducts);

router.get("/carts/:cid", ViewsRouterController.getCartById);

router.get("/cart", async (req, res) => {
  const user = req.session.user;
  const cart = await cartModel.findById(user.cart).populate("products.product");
  console.log(cart);
  if (!cart) {
    return res.status(404).json({ status: "error", message: "Cart not found" });
  }

  const filteredProducts = cart.products.filter((p) => p.product !== null);

  res.render("carts", {
    user: user,
    cart: cart,
    products: filteredProducts.map((p) => p.toJSON()), 
  });
});

router.get("/products", ViewsRouterController.getProductWithPaginate);

router.get("/users/register", ViewsRouterController.getUsersRegister);

router.get("/users/login", ViewsRouterController.getUsersLogin);

router.get("/users", ViewsRouterController.getUsers);

router.get("/forgot-password", (req, res) => {
  res.render("forgotPassword");
});

router.get("/reset-password", verifyEmailTokenMW(), (req, res) => {
  const token = req.query.token;
  res.render("resetPassword", { token });
});

router.post("/products/addToCart", ViewsRouterController.addProductToCart);

export { router as viewRouter };
