import { connectDB } from "../config/dbConnection.js";
import { CartMongo } from "./repository/cart-mongo.js";
import { ProductMongo } from "./repository/product-mongo.js";

connectDB()
export const productDao = new ProductMongo();
export const cartDao = new CartMongo();