import cartModel from "../dao/fileSystem/mongodb/models/cart.model.js";
import productModel from "../dao/fileSystem/mongodb/models/product.model.js";

class CartController {
  static getCart = async (req, res) => {
    const cart = await cartModel.find();
    res.json(cart);
  };

  static getCartById = async (req, res) => {
    const cartId = req.params.cid;
    const cart = await cartModel.findById(cartId);
    res.json(cart);
  };

  static addCart = async (req, res) => {
    const cart = req.body;
    const newCart = await cartModel.create(cart);
    res.json(newCart);
  };

  static addProdToCart = async (req, res) => {
    try {
      const { cid, pid } = req.params;
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

      res.json(cart);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };

  static updateCart = async (req, res) => {
    const cid = req.params;
    const cartBody = req.body;
    const cart = await productModel.findByIdAndUpdate(cid, cartBody);
    res.send({
      status: "success",
      cart: cart,
    });
  };

  static updateProdToCart = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cartId = await cartModel.findById(cid);
    const productId = await productModel.findById(pid);
    if (!cartId) {
      res.status(404).json({ message: "Cart not found" });
    } else if (!productId) {
      res.status(404).json({ message: "Product not found" });
    }

    if (quantity < 1)
      res.status(404).json({ message: "Quantity must be greater than 0" });

    const existingProduct = cartId.products.find((p) => p.product == pid);
    if (existingProduct) {
      existingProduct.quantity = quantity;
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
    await cartId.save();

    res.json(cartId);
  };

  static deleteCart = async (req, res) => {
    const cid = req.params.cid;
    const cart = await cartModel.findByIdAndDelete(cid);
    res.json(cart);
  };

  static deleteProdToCart = async (req, res) => {
    const { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);
    const product = await productModel.findById(pid);
    if (!cart) {
      res.status(404).json({ message: "Cart not found" });
    } else if (!product) {
      res.status(404).json({ message: "Product not found" });
    }

    const existingProduct = cart.products.find((p) => p.product == pid);
    if (existingProduct) {
      if (existingProduct.quantity > 1) {
        existingProduct.quantity--;
      } else {
        cart.products = cart.products.filter((p) => p.product != pid);
      }
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
    await cart.save();

    res.json(cart);
  };
}

export { CartController };
