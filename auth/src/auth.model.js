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
    const salt = await bcrypt.genSalt(10);
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
userSchmema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.__v;
  return obj;
};

//module oluştur
const User = mongoose.model("User", userSchmema);

module.exports = User;
