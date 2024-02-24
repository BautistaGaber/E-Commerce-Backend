import { connectDB } from "../config/dbConnection.js";
import { CartMongo } from "./repository/cart-mongo.js";
import { ProductMongo } from "./repository/product-mongo.js";
import { TicketMongo } from "./repository/ticket-mongo.js";
import { UserMongo } from "./repository/user-mongo.js";

connectDB()
export const productDao = new ProductMongo();
export const cartDao = new CartMongo();
export const ticketDao = new TicketMongo();
export const userDao = new UserMongo()