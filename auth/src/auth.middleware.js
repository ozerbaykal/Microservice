const authService = require("./auth.service");

//token i doğrulayacak middleware
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Bu route a erişme yetkiniz yok" });
  }
  const accessToken = authHeader.split(" ")[1];
  const user = await authService.validateToken(accessToken);

  req.user = user;
  next();
};

module.exports = authenticate;
