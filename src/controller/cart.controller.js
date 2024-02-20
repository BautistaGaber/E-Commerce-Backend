import cartModel from "../dao/fileSystem/mongodb/models/cart.model.js";
import productModel from "../dao/fileSystem/mongodb/models/product.model.js";
import { cartDao } from "../dao/index.js";

class CartController {
  static getCart = async (req, res) => {
    try {
      const cart = await cartDao.getCart();
      return res.json({
        status: "success",
        message: cart,
      });
    } catch {
      return res.status(404).send({ status: "error", message: error.message });
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
    } catch (error) {
      return res.status(404).send({ status: "error", message: error.message });
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
    } catch (error) {
      return res.status(404).send({ status: "error", message: error.message });
    }
  };

  static addProdToCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const cart = await cartDao.addProdToCart(cid, pid);
      return res.json({ status: "success", message: cart });
    } catch (error) {
      return res.status(404).send({ status: "error", message: error.message });
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
    } catch (error) {
      return res.status(404).send({ status: "error", message: error.message });
    }
  };

  static updateProdToCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const result = await cartDao.updateProdToCart(cid, pid, quantity);
      return res.json({ status: "success", message: result });
    } catch(error) {
      return res.status(404).send({ status: "error", message: error.message });
    }
  };

  static deleteCart = async (req, res) => {
    try {
      const cid = req.params.cid;
      const result = await cartDao.deleteCart(cid);
      return res.json({ status: "success", message: result });
    } catch (error) {
      return res.status(404).send({ status: "error", message: error.message });
    }
  };

  static deleteProdToCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const result = await cartDao.deleteProdToCart(cid, pid);

      return res.json({ status: "success", message: result });
    } catch (error) {
      return res.status(404).send({ status: "error", message: error.message });
    }
  };
}

export { CartController };
