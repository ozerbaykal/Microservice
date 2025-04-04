const authService = require("./auth.service");

//token i doğrulayacak middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "Bu route a erişme yetkiniz yok" });
    }
    const accessToken = authHeader.split(" ")[1];
    const user = await authService.validateToken(accessToken);

    req.user = user;
    next();
  } catch (error) {
    if (error.message === "invalid signature") {
      return res.status(404).json({ message: "Bu Route'q erişim yerkiniz yok" });
    }
    next(error);
  }
};

module.exports = authenticate;
