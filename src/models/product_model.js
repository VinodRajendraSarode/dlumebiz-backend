const { Schema, model, Types } = require("mongoose");

const productSchema = new Schema({
  product: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  hsn: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    default: 1,
  },
  purchased_price: {
    type: Number,
  },
  mrp: {
    type: Number,
  },
  selling_price: {
    type: Number,
  },
  company_id: { 
    type: Types.ObjectId, 
    ref: "Company", 
  },
  createdOn: { 
    type: Date, 
    default: Date.now 
  },
  updatedOn: { 
    type: Date, 
    default: Date.now 
  },
  createdBy: { type: String },
  updatedBy: { type: String },
});

productSchema.virtual("stock_details", {
  ref: "StockManagement",
  localField: "_id",       
  foreignField: "product_id" 
});

// Middleware for setting timestamps
productSchema.pre("save", function (next) {
  this.updatedOn = new Date();
  if (!this.createdOn) this.createdOn = new Date();
  next();
});

productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  delete update._id; // prevent overwriting _id
  if (!update.$set) update.$set = {};
  update.$set.updatedOn = new Date();
  next();
});

const Product = model("Product", productSchema);

module.exports = Product;
