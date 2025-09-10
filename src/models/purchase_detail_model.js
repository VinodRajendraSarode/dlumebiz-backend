const { Schema, model, Types } = require("mongoose");

const PurchaseDetailsSchema = new Schema({
  product_id: { type: Types.ObjectId, ref: "Product" },
  purchase_order_id: { type: Types.ObjectId, ref: "PurchaseOrder" },
  company_id: { type: Types.ObjectId, ref: "Company" },
  qty: { type: String, default: "" },
  price: { type: Number, required: true },
  mrp: { type: Number, required: true },
  selling_price: { type: Number, default: 0},
  amount: { type: Number, required: true },  
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now },
});

PurchaseDetailsSchema.pre("save", function (next) {
  this.updatedOn = new Date();
  if (!this.createdOn) this.createdOn = new Date();
  next();
});

PurchaseDetailsSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  delete update._id;
  this.updatedOn = new Date();
  next();
});

const PurchaseDetail = model("PurchaseDetail", PurchaseDetailsSchema);
module.exports = PurchaseDetail;
