const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const productRoutes = require("./src/product.routes");
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
app.use("/", productRoutes);

//hata middleware

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ message: err?.message || "Birşeyler ters gitti" });
});

//404 middleware
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint bulunamadı" });
});

//dinlemeye başla

const PORT = process.env.PORT || 3004;

app.listen(PORT, () => {
  console.log(`Auth service'i ${PORT} portunda çalışıyor..`);
});
