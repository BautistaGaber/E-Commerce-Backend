import cartModel from "../dao/fileSystem/mongodb/models/cart.model.js";
import productModel from "../dao/fileSystem/mongodb/models/product.model.js";
import { cartDao } from "../dao/index.js";

class ViewsRouterController {
  static getProducts = async (req, res) => {
    const products = await productModel.find();
    res.render("home", { products });
  };

  static getCartById = async (req, res) => {
    const cartId = req.params.cid;
    try {
      const cart = await cartModel
        .findById(cartId)
        .populate("products.product");

      const { products } = cart;

      res.render("carts", {
        cart: cartId,
        products: products.map((p) => p.toJSON()),
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

  static getProductWithPaginate = async (req, res) => {
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
  };

  static addProductToCart = async (req, res) => {
    const { pid } = req.body;
    const userSession = req.session.user;
    try {
      console.log(req.session.user);
      const cart = await cartDao.getCartById(userSession.cart);
      console.log("console",cart);
      const product = await productModel.findById(pid);
      if (!cart) {
        res.status(404).json({ message: "Cart or product not found" });
        return;
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
  };

  static getUsersRegister = (req, res) => {
    res.render("register");
  };

  static getUsersLogin = (req, res) => {
    res.render("login");
  };

  static getUsers = (req, res) => {
    res.render("profile", { user: req.session.user });
  };

  static getRealTimeProducts = async (req, res) => {
    res.render("realTimeProducts", {});
  };
}

export { ViewsRouterController };
