import express from "express";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import { productsRouter } from "./routes/products.js";
import { viewRouter } from "./routes/view-router.js";
import { cartsRouter } from "./routes/carts.js";
import mongoose from "mongoose";
import productModel from "./dao/fileSystem/mongodb/models/product.model.js";
import { messageRouter } from "./routes/message.js";
import messageModel from "./dao//fileSystem/mongodb/models/message.model.js";
import { userRouter } from "./routes/user.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import inicializePassport from "./config/passport.config.js";
import passport from "passport";

const app = express();
const PORT = 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const MONGO =
  "mongodb+srv://bautistagaber:UZ7N4k7m88BIAs2L@cluster0.hdnj5k1.mongodb.net/segunda-preentrega";

const connection = mongoose.connect(MONGO);

app.use(
  session({
    store: new MongoStore({
      mongoUrl: MONGO,
    }),
    secret: "1234",
    resave: false,
    saveUninitialized: false,
  })
);
   
inicializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/message", messageRouter);
app.use("/views", viewRouter);
app.use("/users", userRouter);

app.get("/", (req, res) => {
  req.session.user = "Active Session";
  console.log(req.session.user);
  res.send("Session Set");
});

const httpServer = app.listen(PORT, () =>
  console.log(`Server running on port: ${PORT}`)
);

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("new connection");

  socket.on("disconnect", () => {
    console.log("user disconnect");
  });

  socketServer.emit("messages", await messageModel.find());

  socket.emit("initialProducts", await productModel.find());

  socket.on("newProduct", async (newProd) => {
    await productModel.create(newProd);
    const updatedProducts = await productModel.find();
    socket.emit("updateProducts", updatedProducts);
  });

  socket.on("deleteProduct", async (idToDelete) => {
    console.log(idToDelete);
    if (idToDelete) {
      await productModel.findByIdAndDelete(idToDelete);
      const updatedProducts = await productModel.find();
      socketServer.emit("updateProducts", updatedProducts);
    } else {
      console.error("no hay id valido");
    }
  });

  socket.on("newUser", (user) => {
    console.log(`>${user} se ha conectado`);
  });

  socket.on("chat-messages", async (message) => {
    await messageModel.create(message);
    const messages = await messageModel.find();
    socketServer.emit("message", messages);
  });

  socket.emit("msg", "bienvenido al chat");

  socket.on("newUser", (user) => {
    socket.broadcast.emit("newUser", user);
  });

  socket.on("chat:typing", (user) => {
    socket.broadcast.emit("chat:typing", user);
  });
});

export default socketServer;
