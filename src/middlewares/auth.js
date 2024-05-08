import jwt from "jsonwebtoken";

export const checkRol = (roles) => {
  return (req, res, next) => {
    console.log(req.user);
    if (!req.user) {
      return res.json({ status: "error", message: "need to be authorized" });
    }
    if (roles.includes(req.user.role)) {
      return res.json({ status: "error", message: "unauthorized" });
    }
    next();
  };
};

export const verifyEmailTokenMW = () => {
  return (req, res, next) => {
    try {
      const jwtToken = req.query.token;
      const decoded = jwt.decode(jwtToken);
      const expTime = decoded.exp * 1000;
      const expDate = new Date(expTime);
      console.log(expDate);
      const currentDate = new Date();
      console.log(currentDate);

      if (currentDate > expDate) {
        return res.json({ status: "error", message: "Token vencido" });
      }
    } catch (err) {
      res.status(401).json({ status: "error", message: "token error" });
    }
    next();
  };
};
