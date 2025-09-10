const { Schema, model, Types } = require("mongoose");

const saleOrderSchema = new Schema({
  company_id: { type: Types.ObjectId, ref: "Company" },
  client_id: { type: Types.ObjectId, ref: "Client" },
  order_date: { type: Date, default: Date.now },
  invoice_no: { type: String, default: "" },
  status: {
    type: String,
    enum: ["pending", "in_progress", "completed"],
    default: "pending",
  },
  gst: { type: Boolean, default: false },
  amount: { type: Number },
  amount_befor_tax: { type: Number },
  sgst: { type: Number, default: 0  },
  cgst: { type: Number, default: 0 },
  igst: { type: Number, default: 0 },
  discount: { type: Number, default: 0  },
  discounted_amount: { type: Number },
  total_amount: { type: Number },
  paid_amount: { type: Number, default: 0 },
  remarks: { type: String, default: "" },

  createdOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now },
});

saleOrderSchema.pre("save", async function (next) {
  this.updatedOn = new Date();
  if (!this.createdOn) this.createdOn = new Date();

  if (this.isNew && !this.invoice_no) {
    const last = await this.constructor
      .findOne()
      .sort({ created_at: -1 })
      .select("invoice_no");

    let nextNumber = 1;
    if (last && last.invoice_no) {
      const match = last.invoice_no.match(/I-(\d+)/);
      if (match && match[1]) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    this.invoice_no = `I-${String(nextNumber).padStart(5, "0")}`;
  }

  next();
});

saleOrderSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  delete update._id;
  this.updatedOn = new Date();
  next();
});

const SaleOrderModel = model("SaleOrder", saleOrderSchema);
module.exports = SaleOrderModel;
