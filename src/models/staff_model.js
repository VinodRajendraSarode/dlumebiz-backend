const { Schema, model } = require("mongoose");

const staffSchema = new Schema(
  {
    company_id: { type: Schema.Types.ObjectId, ref: "Company" },
    user_id: { type: Schema.Types.ObjectId, ref: "User" },
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
    country: {
      type: String,
      default: "",
    },
    pincode: {
      type: String,
      default: "",
    },
    designation: {
      type: String,
      default: "",
    },
    active: {
      type: Boolean,
      default: true, 
    },


    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

staffSchema.pre("save", function (next) {
  this.updatedOn = new Date();
  if (!this.createdOn) this.createdOn = new Date();
  next();
});

staffSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  delete update._id;
  this.updatedOn = new Date();
  next();
});

const StaffModel = model("Staff", staffSchema);
module.exports = StaffModel;
