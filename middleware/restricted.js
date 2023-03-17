const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../api/config/config");
const restricted = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decodedJWT) => {
      if (err) {
        next({
          status: 401,
          message: "token geçersizdir",
        });
      } else {
        req.userInfo = decodedJWT;
        console.log(req.userInfo);
        next();
      }
    });
  } else {
    next({
      status: 401,
      message: "token gereklidir",
    });
  }
};
const checkRole = (role_name) => (req, res, next) => {
  try {
    if (role_name !== req.userInfo.role_name) {
      res.json({ message: "Burası senin için değil " });
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
};
module.exports = { restricted, checkRole };
