import { Router } from "express";
import productModel from "../dao//fileSystem/mongodb/models/product.model.js";
import cartModel from "../dao/fileSystem/mongodb/models/cart.model.js";
import socketServer from "../app.js";

const router = Router();

router.get("/home", async (req, res) => {
  const products = await productModel.find();
  res.render("home", { products });
});

router.get("/realTimeProducts", async (req, res) => {
  res.render("realTimeProducts", {});
});

router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;
  try {
    const cart = await cartModel.findById(cartId).populate("products.product");
    console.log(JSON.stringify(cart, null, "/t"));

    const { products } = cart;

    res.render("carts", {
      cart: cartId,
      products: products.map((p) => p.toJSON()),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/products", async (req, res) => {
  const { page = 1, limit = 10, sort, category, status } = req.query;
  const queryOptions = {};

  if (category) {
    queryOptions.category = category;
  }

  if (status === "avaliable") {
    queryOptions.stock = { $gt: 0 };
  } else if (status === "unavailable") {
    queryOptions.stock = { $eq: 0 };
  }

  const products = await productModel.paginate(queryOptions, {
    limit: limit,
    page: page ?? 1,
    sort: sort
      ? { price: sort === "desc" ? -1 : sort === "asc" ? 1 : 0 }
      : undefined,
    lean: true,
  });
  res.render("products", { products: products });
});

router.post("/products/addToCart", async (req, res) => {
  const { cid, pid } = req.body;
  try {
    const cart = await cartModel.findById(cid);
    const product = await productModel.findById(pid);
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
    } else if (!product) {
      res.status(404).json({ message: "Product not found" });
    }

    const existingProduct = cart.products.find((p) => p.product == pid);
    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }
    await cart.save();

    res.redirect("/views/products");
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

router.get("/users/register", (req, res) => {
  res.render("register");
});

router.get("/users/login", (req, res) => {
  res.render("login");
});

router.get("/users", (req, res) => {
  res.render("profile", { user: req.session.user });
});

export { router as viewRouter };
