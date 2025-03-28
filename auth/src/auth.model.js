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
    password: {
      type: String,
      require: true,
      minlength: 6,
    },
    firstName: {
      type: String,
      unique: true,
      trim: true,
    },
    lastName: {
      type: String,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

//kullanıcıyı kaydetmeden önce şifreyi hash'le
userSchmema.pre("save", async function (next) {
  //şifre değişmediyse hashleme işlemini iptal et
  if (!this.isModified("password")) return next();

  try {
    const salt = bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    next(error);
  }
});

//orjinal şifreyle hashlenmiş şifreyi karşılaştıran method
userSchmema.methods.comparePassword = async function (candidatePass) {
  return bcrypt.compare(candidatePass, this.password);
};

//client 'a cevap göndermeden önce  hassas verileri gizle

//module oluştur
const User = mongoose.model("User", userSchmema);
