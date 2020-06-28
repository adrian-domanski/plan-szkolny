const jwt = require("jsonwebtoken");
const config = require("config");

const auth = (req, _, next) => {
  const token = req.headers.token || req.cookies.token;
  if (!token) {
    return next();
  }
  try {
    const { userId } = jwt.verify(token, config.get("jwtSecret"));
    req.user = { id: userId };
  } catch (err) {
    console.log(err);
  }
  return next();
};

module.exports = auth;
