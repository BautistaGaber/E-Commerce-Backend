import { PurchaseProductDTO } from "../DTOs/purchaseProduct.js";
import productModel from "../dao/fileSystem/mongodb/models/product.model.js";
import { cartDao, ticketDao, userDao } from "../dao/index.js";

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
    } catch (error) {
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

  static addPurchase = async (req, res) => {
    const cartId = req.params.cid;
    try {
      const cart = await cartDao.getCartById(cartId);
      let productsToPurchase = []

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

      cart.products.forEach((elem) => {
        if (elem.product.stock >= elem.quantity) {
          elem.product.stock = elem.product.stock - elem.quantity;
          productsToPurchase.push(new PurchaseProductDTO(elem.product));
          cart.products.filter((product) => product != elem);
        }
      });
      console.log(cart);

      let purchasePrice = 0;
      productsToPurchase.forEach((elem) => {
        let totalPerElement = elem.price * elem.quantity;
        purchasePrice += totalPerElement;
      });

      const user = await userDao.getUserByCart(cart);

      const ticket = {
        code: Math.floor(Math.random() * 1000000),
        purchase_datetime: new Date(),
        amount: cart.totalPrice,
        purchase: user.email,
      };

      const newTicket = await ticketDao.createTicket(ticket);

      return res.json({ status: "success", message: newTicket });
    } catch (error) {
      return res.status(404).send({ status: "error", message: error.message });
    }
  };
}

export { CartController };