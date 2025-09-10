const companyModel = require("../models/company_model");
const UserModel = require("../models/user_model");

const companyControler = {
  index: async function (req, res) {
    try {
      const companies = await companyModel.find();

      return res.json({ success: true, data: companies });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message || error,
      });
    }
  },

  create: async function (req, res) {
    try {
      const data = req.body;
      const company = new companyModel(data);
      await company.save();

      const password = `${company.name.replace(/\s+/g, '').toLowerCase()}123`;

      const adminUser = new UserModel({
        fullName: data.name,
        email: data.email,
        password: password, 
        phoneNumber: data.mobile,
        company_id: company._id,
        role: "admin",
      });

      await adminUser.save();

      return res.json({
        success: true,
        data: company,
        message: "Company Created Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message || error,
      });
    }
  },

  fetch: async function (req, res) {
    try {
      const id = req.params.id;
      const company = await companyModel.findById(id);

      return res.json({ success: true, data: company });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message || error,
      });
    }
  },

  update: async function (req, res) {
    try {
      const id = req.params.id;
      const updateData = req.body;

      const updatedCompany = await companyModel.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedCompany) {
        return res
          .status(404)
          .json({ success: false, message: "Company not found" });
      }

      return res.json({ success: true, data: updatedCompany });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message || error,
      });
    }
  },

  delete: async function (req, res) {
    try {
      const id = req.params.id;

      const deletedCompany = await companyModel.findByIdAndDelete(id);

      if (!deletedCompany) {
        return res
          .status(404)
          .json({ success: false, message: "Company not found" });
      }

      return res.json({
        success: true,
        message: "Company deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message || error,
      });
    }
  },
};

module.exports = companyControler;
