import { Router } from "express";
import passport from "passport";
import { UserController } from "../controller/user.controller.js";

const router = new Router();

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "" }),
  UserController.register
);

router.get("/failregister", async (req, res) => {
  console.log("fallo en el registro");
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "" }),
  UserController.login
);

router.get("/faillogin", (req, res) => {
  res.send({ error: "fail login" });
});

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"], session: false }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { scope: ["user:email"], sesion: false }),
  UserController.gitHubCallback
);

export { router as userRouter };
