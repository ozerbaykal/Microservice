const mongoose = require("mongoose");

const orderSchmema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

//client 'a cevap göndermeden önce  hassas verileri gizle

//module oluştur
const Order = mongoose.model("Order", orderSchmema);
