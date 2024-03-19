import { UserDTO } from "../DTOs/user.js";
import { sendRecoveryPass } from "../config/gmail.js";
import { userDao } from "../dao/index.js";
import {
  createHash,
  generateEmailToken,
  generateToken,
  validatePassword,
  verifyEmailToken,
} from "../utils.js";

class UserController {
  static register = async (req, res) => {
    const user = req.body;
    const accessToken = generateToken();

    req.session.user = new UserDTO(user);

    return res.status(200).send(accessToken);
  };

  static login = async (req, res) => {
    if (!req.user) {
      return res.status(400).send({
        status: "Error",
        error: "Datos incorrectos",
      });
    }
    req.session.user = new UserDTO(req.user);
    res.send({ status: "success", payload: req.session.user });
  };

  static gitHubCallback = async (req, res) => {
    console.log(req.user);
    res.redirect("/views/home");
  };

  static forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;
      console.log(email);
      const user = await userDao.getUserByEmail(email);
      console.log(user);
      if (!user) {
        res.send(
          `<div>Error no existe el usuario, vuelva a intentar: <a href="/views/forgot-password">Intente de nuevo</a></div>`
          );
        }
        
      console.log("object");
      const token = generateEmailToken(email, 60*3);
      console.log(token);
      await sendRecoveryPass(email, token);
      res.send("Se envio el correo de recuperacion.");
    } catch (error) {
      res.send(
        `<div>Error,<a href="/views/forgot-password">Intente de nuevo</a></div>`
      );
    }
  }

  static resetPassword = async(req, res) => {
    try {
      const token = req.query.token;

      const { email, newPassword } = req.body;

      const validToken = verifyEmailToken(token);

      if (!validToken) {
        return res.send(`El token ya no es valido`);
      }
      const user = await userDao.getUserByEmail(email);
      console.log(user);

      if (!user) {
        return res.send("el Usuario no esta registrado");
      }

      if (validatePassword(newPassword, user)) {
        return res.send("no se puede usar la misma contraseña");
      }
      const userData = {
        ...user._doc,
        password: createHash(newPassword),
      };
      const updateUser = await userDao.updateUserByEmail( email, userData);

      res.render("login", { message: "Contraseña actualizada" });
    } catch (error) {
      console.log(error);
      res.send(`<div>Error, hable con el administrador.</div>`);
    }
  }

  static changeRole = async (req, res) => {
    try {
      const userId = req.params.uid;
      const user = await userDao.getUserbyId(userId);
      const userRol = user.role;
      if (userRol === "user") {
        user.role = "premium";
      } else if (userRol === "premium") {
        user.role = "user";
      } else {
        return res.json({
          status: "error",
          message: "no es posible cambiar el role del usuario",
        });
      }
      await userDao.updateUser(userId); 
      res.send({ status: "success", message: "rol modificado" });
    } catch (error) {
      console.log(error.message);
      res.json({
        status: "error",
        message: "hubo un error al cambiar el rol del usuario",
      });
    }
  };
}

export { UserController };
