const { Schema, model, Types } = require("mongoose");

const itemSchema = new Schema({
  product: {
    type: String,
    required: true,
  },
  type: {
    type: String,
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

// Middleware for setting timestamps
itemSchema.pre("save", function (next) {
  this.updatedOn = new Date();
  if (!this.createdOn) this.createdOn = new Date();
  next();
});

itemSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  delete update._id; // prevent overwriting _id
  if (!update.$set) update.$set = {};
  update.$set.updatedOn = new Date();
  next();
});

const Item = model("Item", itemSchema);

module.exports = Item;
