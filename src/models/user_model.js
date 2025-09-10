const { Schema, model } = require("mongoose");
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new Schema({
  company_id: { type: Schema.Types.ObjectId, ref: "Company" },
  name: { type: String, default: "" },
  email: { type: String, unique: true, require: true },
  password: { type: String, require: true },
  phoneNumber: { type: String, default: "" },
  address: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  role: { type: String, default: "user" },
  profileProgress: { type: Number, default: 0 },
  updatedOn: { type: Date },
  createdOn: { type: Date },
  active: {
    type: Boolean,
    default: true, 
  },
});

userSchema.pre("save", function (next) {
  this.updatedOn = new Date();
  this.createdOn = new Date();

  try {
    const salt = bcrypt.genSaltSync(10);
    if (!this.password) {
      throw new Error("Password is missing");
    }
    const hash = bcrypt.hashSync(this.password, salt);
    this.password = hash;
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  delete update._id;
  this.updatedOn = new Date();

  next();
});

// sign access token
userSchema.methods.SignAccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.ACCESS_TOKEN || "", {
    expiresIn: "5m",
  });
};

// sign refresh token
userSchema.methods.SignRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN || "", {
    expiresIn: "3d",
  });
};  

const UserModel = model("User", userSchema);

module.exports = UserModel;
