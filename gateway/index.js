const express = require("express");
const httpProxy = require("http-proxy");
require("dotenv").config();

const app = express();
const proxy = httpProxy.createProxyServer({});

//gerekli yönlendirmeler
app.use("/api/auth", (req, res) => {
  proxy.web(req, res, { target: process.env.AUTH_SERVICE_URL });
});
app.use("/api/products", (req, res) => {
  proxy.web(req, res, { target: process.env.PRODUCT_SERVICE_URL });
});
app.use("/api/orders", (req, res) => {
  proxy.web(req, res, { target: process.env.ORDER_SERVICE_URL });
});

//gateaway 'i ayağa kaldır
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API Gateway ${port} portunda çalışıyor`);
});
