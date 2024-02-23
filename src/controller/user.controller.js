import { UserDTO } from "../DTOs/user.js";

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
}

export { UserController };
