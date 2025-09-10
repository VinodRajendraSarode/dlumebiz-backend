const { Schema, model, Types } = require("mongoose");

const SaleDetailsSchema = new Schema({
  product_id: { type: Types.ObjectId, ref: "Product" },
  sales_order_id: { type: Types.ObjectId, ref: "SaleOrder" },
  company_id: { type: Types.ObjectId, ref: "Company" },
  qty: { type: String, default: "" },
  price: { type: Number },
  mrp: { type: Number },
  selling_price: { type: Number, default: 0  },
  amount: { type: Number },  
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now },
});

SaleDetailsSchema.pre("save", function (next) {
  this.updatedOn = new Date();
  if (!this.createdOn) this.createdOn = new Date();
  next();
});

SaleDetailsSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  delete update._id;
  this.updatedOn = new Date();
  next();
});

const SaleDetail = model("SaleDetail", SaleDetailsSchema);
module.exports = SaleDetail;
