import mongoose from "mongoose";
import productModel from "./product.model.js";

const cartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: productModel },
        quantity: { type: Number, default: 1 },
        _id: false,
      },
    ],
  },
  total: {
    type: Number,
    default: 0,
  },
});

const cartModel = mongoose.model("carts", cartSchema);

export default cartModel;
