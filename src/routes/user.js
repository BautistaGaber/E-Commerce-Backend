import { Router } from "express";
import userModel from "../dao/fileSystem/mongodb/models/user.model.js";
import { createHash, validatePassword } from "../utils.js";
import passport from "passport";

const router = new Router();

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "" }),
  async (req, res) => {
    res.send({ status: "success", message: "User registered successfully" });
  }
);

router.get("/failregister", async (req, res) => {
  console.log("fallo en el registro");
});

router.post(
  "login",
  passport.authenticate("login", { failureRedirect: "" }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send({
        status: "Error",
        error: "Datos incorrectos",
      });
    }
    req.session.user = {
      fullName: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      age: req.user.age,
    };
    res.send({ status: "success", payload: req.session.user });
  }
);

router.get("/faillogin", (req, res) => {
  res.send({ error: "fail login" });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  }
);

export { router as userRouter };
