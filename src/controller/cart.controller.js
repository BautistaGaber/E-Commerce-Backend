import { PurchaseProductDTO } from "../DTOs/purchaseProduct.js";
import productModel from "../dao/fileSystem/mongodb/models/product.model.js";
import { cartDao, productDao, ticketDao, userDao } from "../dao/index.js";
import { ProductController } from "./product.controller.js";

class CartController {
  static getUserCart = async (req, res) => {
    try {
      console.log(req.session.user);
      const result = req.session.user.cart;
      return res.status(200).json({
        status: "success",
        cartId: result,
      });
    } catch (err) {
      req.logger.error(err.message);
      return res.status(404).send({ status: "error", message: err.message });
    }
  };

  static getCartById = async (req, res) => {
    try {
      const cartId = req.params.cid;
      const cart = await cartDao.getCartById(cartId);
      return res.json({
        status: "success",
        message: cart,
      });
    } catch (err) {
      req.logger.error(err.message);
      return res.status(404).send({ status: "error", message: err.message });
    }
  };

  static addCart = async (req, res) => {
    try {
      const cart = req.body;
      const newCart = await cartDao.addCart(cart);
      return res.json({
        status: "success",
        message: newCart,
      });
    } catch (err) {
      req.logger.error(err.message);
      return res.status(404).send({ status: "error", message: err.message });
    }
  };

  static addProdToCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const quantity = req.body.quantity;
      const cart = await cartDao.addProdToCart(cid, pid, quantity);
      return res.json({ status: "success", message: cart });
    } catch (err) {
      req.logger.error(err.message);
      return res.status(404).send({ status: "error", message: err.message });
    }
  };

  static updateCart = async (req, res) => {
    try {
      const cid = req.params;
      const cartBody = req.body;
      const cart = await cartDao.updateCart(cid, cartBody);
      res.send({
        status: "success",
        cart: cart,
      });
    } catch (err) {
      req.logger.error(err.message);
      return res.status(404).send({ status: "error", message: err.message });
    }
  };

  static updateProdToCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const result = await cartDao.updateProdToCart(cid, pid, quantity);
      return res.json({ status: "success", message: result });
    } catch (err) {
      req.logger.error(err.message);
      return res.status(404).send({ status: "error", message: err.message });
    }
  };

  static deleteCart = async (req, res) => {
    try {
      const cid = req.params.cid;
      const result = await cartDao.deleteCart(cid);
      return res.json({ status: "success", message: result });
    } catch (err) {
      req.logger.error(err.message);
      return res.status(404).send({ status: "error", message: err.message });
    }
  };

  static deleteProdToCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const result = await cartDao.deleteProdToCart(cid, pid);

      return res.json({ status: "success", message: result });
    } catch (err) {
      req.logger.error(err.message);
      return res.status(404).send({ status: "error", message: err.message });
    }
  };

  static addPurchase = async (req, res) => {
    try {
      const cartId = req.session.user.cart;
      const cart = await cartDao.getCartById(cartId);

      if (!cart) {
        return res
          .status(404)
          .send({ status: "error", message: "Cart not found" });
      }

      if (cart.products.length === 0) {
        return res
          .status(404)
          .send({ status: "error", message: "Cart is empty" });
      }

      let totalAmount = 0;

      cart.products.forEach(async (elem) => {
        try {
          const product = await productDao.getProductById(elem.product);
          console.log("product", product);

          if (!product) {
            throw new Error("Product not found");
          }
          product.stock = product.stock - elem.quantity;
          console.log("stock", product.stock);
          console.log("id:", product._id);
          console.log("prod:", product);

          if (product.stock <= 0) {
            // await CartController.deleteProdToCart(cartId, elem.product); 
            await productDao.deleteProductById(product._id);
          } else {
            productDao.updateProductById(product._id, product);
          }
 
          totalAmount += product.price * elem.quantity; 
        } catch (err) { 
          throw new Error(err.message);
        }
      });
      console.log("cart", cart);

      const user = await userDao.getUserByCart(cart);

      console.log("user:", user);

      const ticket = {
        code: Math.floor(Math.random() * (1000000 - 1000 + 1)) + 1000,
        purchase_datetime: new Date(),
        amount: totalAmount,
        purchase: req.session.user.email,
      };

      await ticketDao.createTicket(ticket);

      console.log(ticket);

      cart.products = [];
      cart.total = 0;

      await cartDao.updateCart(cartId, cart);

      return res.json({ status: "success", message: ticket });
    } catch (error) {
      return res.status(404).send({ status: "error", message: error.message });
    }
  };
}

export { CartController };
