const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./src/auth.routes");
const cookieParser = require("cookie-parser");
require("dotenv").config();

//express uygulması oluştur
const app = express();

//mongodb ye bağlan
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("🎾 MongoDB'ye bağlandı🎾"))
  .catch((err) => console.log("MongoDB 'ye bağlantı hatası 🤢 😭", err));

//middlewareleri tanıtalım
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

//rate limit
const limiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS,
});
app.use("/", limiter);

//route
app.use("/", authRoutes);

//hata middleware

app.use((err, req, res, next) => {
  res.status(500).json({ status: "fail", message: err.message || "Birşeyler ters gitti " });
});

//404 middleware
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint bulunamadı" });
});

//dinlemeye başla

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Auth service'i ${PORT} portunda çalışıyor..`);
});
