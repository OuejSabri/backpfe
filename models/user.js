const { required } = require("joi");
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const userSchema = mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telephone: { type: String, required: false },
  role: {
    type: String,
    enum: ["stagiaire", "societe", "admin"],
    required: true,
  },
  password: { type: String, required: true },
  rep_password: { type: String },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  verificationCode: {
    type: Number,
    default: null,
  },
  verificationCodeExpiration: {
    type: Date,
  },
  resetPasswordCode: {
    type: Number,
    default: null,
  },
  resetPasswordCodeExpiration: {
    type: Date,
  },
  resume: { type: String },
});
userSchema.plugin(uniqueValidator);

userSchema.methods.getResetPasswordToken = async function () {
  //Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hashing and add resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};
``
userSchema.methods.correctPassword = async function (userpassword, password) {
  return await bcrypt.compare(userpassword, password);
};

module.exports = mongoose.model("user", userSchema);
