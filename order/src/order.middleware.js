const jwt = require("jsonwebtoken");
//token i doğrulayacak middleware
exports.authenticate = (req, res, next) => {
  //header olarak accsessToken geldimi kontrol et
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "Bu route'a erişim yetkiniz yok" });
  }
  //tokeni al
  const accsessToken = authHeader.split(" ")[1];

  //Token'i doğrula
  try {
    const decoded = jwt.verify(accsessToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Bu route'a erişim yetkiniz yok" });
  }
};
//sadece adminlere izin veren middleware
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Erişim reddedildi,Sadece admin" });
  }
};
