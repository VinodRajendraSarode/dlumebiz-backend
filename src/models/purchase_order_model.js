const PurchaseDetail = require("../models/purchase_detail_model");
const { Schema, model, Types } = require("mongoose");

const purchaseOrderSchema = new Schema({
  company_id: { type: Types.ObjectId, ref: "Company"},
  vendor_id: { type: Types.ObjectId, ref: "Vendor"},  
  order_date: { type: Date, default: Date.now },
  invoice_date: { type: Date, default: Date.now },
  invoice_no: { type: String, default: "" },
  invoice_type: { type: String, default: "" },
  invoice_value: { type: String, default: "" },
  order_no: { type: String, default: "" },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
    default: "pending",
  },
  gst: { type: Boolean, default: true },
  amount: { type: Number },
  amount_befor_tax: { type: Number },
  sgst: { type: Number, default: 0 },
  cgst: { type: Number, default: 0 },
  igst: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  discounted_amount: { type: Number },
  total_amount: { type: Number },
  paid_amount: { type: Number },
  delivery_address: { type: String, default: "" },
  remarks: { type: String, default: "" },
  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now },
});

purchaseOrderSchema.pre("save", async function (next) {
  this.updatedOn = new Date();
  if (!this.createdOn) this.createdOn = new Date();

  if (this.isNew && !this.order_no) {
    const last = await this.constructor
      .findOne()
      .sort({ created_at: -1 })
      .select("order_no");

    let nextNumber = 1;
    if (last && last.order_no) {
      const match = last.order_no.match(/O-(\d+)/);
      if (match && match[1]) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    this.order_no = `O-${String(nextNumber).padStart(5, "0")}`;
  }
  next();
});

purchaseOrderSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  delete update._id;
  this.updatedOn = new Date();
  next();
});

const PurchaseOrderModel = model("PurchaseOrder", purchaseOrderSchema);
module.exports = PurchaseOrderModel;
