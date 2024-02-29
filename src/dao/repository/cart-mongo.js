import cartModel from "../fileSystem/mongodb/models/cart.model.js";
import productModel from "../fileSystem/mongodb/models/product.model.js";

class CartMongo {
  constructor() {
    this.model = cartModel;
  }

  async getCart() {
    try {
      const cart = await cartModel.find();
      return cart;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async getCartById(id) {
    try {
      const cart = await cartModel.findById(id);
      return cart;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async addCart(){
    try{
      const cart = req.body;
      const newCart = await cartModel.create(cart);
      return newCart;
    }
    catch(err){
      throw new Error(err.message);
    }
  }

  async addProdToCart() {
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
      return cart;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateCart() {
    try {
      const cid = req.params;
      const cartBody = req.body;
      const cart = await productModel.findByIdAndUpdate(cid, cartBody);
      return cart;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateProdToCart() {
    try {
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
    } catch {
      throw new Error(err.message);
    }
  }

  async deleteCart() {
    try {
      const cid = req.params;
      const cart = await cartModel.findByIdAndDelete(cid);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async deleteProdToCart() {
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
    } catch {
      throw new Error(err.message);
    }
  }
}

export { CartMongo };
