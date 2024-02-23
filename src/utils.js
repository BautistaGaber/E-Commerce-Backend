import { fileURLToPath } from "url";
import { dirname } from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const PRIVATE_KEY = "jwt-private-key";

export const validateAdminRole = (req, res, next) => {
  const user = req.session.user;
  if (!user) {
    return res.status(401).send({ status: "error", error: "Unhaunthorized" });
  } else if (user.role !== "admin") {
    return res.status(403).send({ status: "error", error: "Forbidden" });
  } else {
    next();
  }
};

export const validateUserRole = (req, res, next) => {
  const user = req.session.user
  if (!user) {
    return res.status(401).send({ status: 'error', error: 'Unhaunthorized' })
  } else if (user.role !== 'user') {
    return res.status(403).send({ status: 'error', error: 'Forbidden' })
  } else {
    next()
  }
}

export const generateToken = (user) => {
  const token = jwt.sign({ user }, PRIVATE_KEY, { expiresIn: "1h" });
  return token;
};

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(" ")[1];
  if (token === "null") {
    return res.status(401).send({ status: "error", error: "Unhaunthorized" });
  }
  jwt.verify(token, PRIVATE_KEY, (err, credentials) => {
    if (err) {
      return res.status(401).send({ status: "error", error: "Unhaunthorized" });
    }
    req.user = credentials.user;
    next();
  });
};

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const validatePassword = (password, user) =>
  bcrypt.compareSync(password, user.password);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;
