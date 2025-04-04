const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchmema = new mongoose.Schema(
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
const User = mongoose.model("User", userSchmema);
