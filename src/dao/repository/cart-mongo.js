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

  async addCart(cart) {
    try {
      const newCart = await cartModel.create(cart);
      return newCart;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async addProdToCart(cartId, productId, quantity) {
    try {
      const cart = await cartModel.findOne({ _id: cartId });
      if (!cart) {
        throw new Error("Cart not found");
      }

      const product = await productModel.findOne({ _id: productId });
      if (!product) {
        throw new Error("Product not found");
      }

      if (quantity > product.stock) {
        throw new Error("Quantity exceeds stock");
      }

      const productExistsInCart = cart.products.find((p) => {
        return p.product._id.toString() === product._id.toString();
      });

      if (!productExistsInCart) {
        cart.products.push({ product: productId, quantity: quantity });
        cart.total = cart.total + product.price * quantity;
      } else {
        const index = cart.products.findIndex((p) => {
          return p.product._id.toString() === product._id.toString();
        });
        cart.products[index].quantity += quantity;
        cart.total = cart.total + product.price * quantity;
      }

      await productModel.updateOne({_id:productId},{$set: product});
      const result = await cartModel.updateOne({_id:cartId},{$set: cart});
      console.log(result);
      return result;
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async updateCart(cartId, cart) {
    try {
      const updatedCart = await cartModel.updateOne({ _id: cartId }, { $set: cart });
      return updatedCart;
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
