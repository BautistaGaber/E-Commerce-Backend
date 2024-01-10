import { Router } from "express";
import userModel from "../dao/fileSystem/mongodb/models/user.model.js";

const router = new Router();

router.post("/register", async (req, res) => {
  const { firstName, lastName, age, email, password } = req.body;
  const existUser = await userModel.findOne({ email: email });
  if (existUser) {
    return res.send({ status: "error", error: "user exists" });
  } else {
    const user = {
      firstName,
      lastName,
      age,
      email,
      password,
    };

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      const newUser = await userModel.create({ ...user, role: "admin" });
    }

    let newUser = await userModel.create(user);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  const user = await userModel.findOne({ email, password });
  if (user) {
    req.session.user = {
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
      age: user.age,
    };
    res.send({
      status: 200,
      payload: req.session.user,
      message: "login",
    });
    console.log("Usuario encontrado:", req.session.user);
  } else {
    return res.status(400).send({
      status: "Error",
      error: "Datos incorrectos",
    });
  }
});

export { router as userRouter };
