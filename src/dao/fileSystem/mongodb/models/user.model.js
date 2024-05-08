import mongoose from "mongoose";
import cartModel from "./cart.model.js";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, max: 100 },
  lastName: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100 },
  age: { type: Number, required: true, max: 100 },
  password: { type: String, required: true, max: 100 },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin", "premium"],
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: cartModel,
  },
});

const userModel = mongoose.model("users", userSchema);

export default userModel;
