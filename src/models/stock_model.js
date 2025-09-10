const { Schema, model, Types } = require("mongoose");

const stockSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: "Product" },
  company_id: {
    type: Types.ObjectId,
    ref: "Company",
    required: true,
  },
  transaction: {
    type: String,
    default: "",
  },
  stock: {
    type: String,
    default: "",
  },

  createdOn: {
    type: Date,
    default: Date.now,
  },
  updatedOn: {
    type: Date,
    default: Date.now,
  },
});

stockSchema.pre("save", function (next) {
  this.updatedOn = new Date();
  if (!this.createdOn) this.createdOn = new Date();
  next();
});

stockSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  delete update._id;
  this.updatedOn = new Date();
  next();
});

const StockModel = model("Stock", stockSchema);

module.exports = StockModel;
