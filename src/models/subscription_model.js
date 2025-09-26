const { Schema, model } = require("mongoose");

const subscriptionSchema = new Schema({
  company_id: { 
    type: Schema.Types.ObjectId, 
    ref: "Company", 
    required: true, 
    unique: true  
  },
  plan_name: { type: String, required: true }, 
  users: { type: Number, default: 1 }, 
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["active", "deactive", "expired", "cancelled"], 
    default: "active" 
  },
  payments: [
    {
      amount: { type: Number, required: true },
      method: { type: String, enum: ["upi", "card", "netbanking", "cash"], required: true },
      transaction_id: { type: String, default: "" },
      date: { type: Date, default: Date.now }
    }
  ],
  createdOn: { type: Date },
  updatedOn: { type: Date },
  createdBy: { type: String },
  updatedBy: { type: String },
});

// Middleware for auto timestamps
subscriptionSchema.pre("save", function (next) {
  if (!this.createdOn) {
    this.createdOn = new Date();
  }
  this.updatedOn = new Date();
  next();
});

// For findOneAndUpdate
subscriptionSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedOn: new Date() });
  next();
});

const SubscriptionModel = model("Subscription", subscriptionSchema);

module.exports = SubscriptionModel;
