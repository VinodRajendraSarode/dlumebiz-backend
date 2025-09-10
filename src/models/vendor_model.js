const { Schema, model, Types } = require("mongoose");

const vendorSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact_no_1: {
    type: String,
    required: true,
  },
  contact_no_2: {
    type: String,
    default: "",
  },
  address_line_1: {
    type: String,
    default: "",
  },
  address_line_2: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  state: {
    type: String,
    default: "",
  },
  pincode: {
    type: String,
    default: "",
  },
  
  company_name: {
    type: String,
    default: "",
  },
  company_id: { type: Types.ObjectId, ref: "Company" },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now },
});

vendorSchema.pre("save", function (next) {
  this.updatedOn = new Date();
  if (!this.createdOn) this.createdOn = new Date();
  next();
});

vendorSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  delete update._id;
  this.updatedOn = new Date();
  next();
});

const vendorModel = model("Vendor", vendorSchema);

module.exports = vendorModel;
