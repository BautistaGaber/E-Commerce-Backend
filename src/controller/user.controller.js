import userModel from "../dao/fileSystem/mongodb/models/user.model.js";
import { createHash, validatePassword } from "../utils.js";

class UserController {
  static register = async (req, res) => {
    res.send({ status: "success", message: "User registered successfully" });
  };

  static login = async (req, res) => {
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
  };

  static gitHubCallback = async (req, res) => {
    console.log(req.user);
    res.redirect("/views/home");
  };
}

export { UserController };
