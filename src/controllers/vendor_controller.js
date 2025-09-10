const vendorModel = require("../models/vendor_model");

const vendorController = {
  // Get all vendors
  index: async function (req, res) {
    try {
      // Pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Search filter (optional)
      const search = req.query.search || "";

      // Build filter object
      const filter = {};
      if (search) {
        filter.$or = [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      // Count total documents for pagination
      const total = await vendorModel.countDocuments(filter);

      // Fetch filtered and paginated vendors
      const vendors = await vendorModel
        .find(filter)
        .populate("company_id")
        .skip(skip)
        .limit(limit)
        .exec();

      return res.json({
        success: true,
        data: vendors,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message || error,
      });
    }
  },

  // Create a new vendor
  create: async function (req, res) {
    try {
      const data = req.body;
      const vendor = new vendorModel(data);
      await vendor.save();

      return res.json({
        success: true,
        data: vendor,
        message: "Vendor Created Successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message || error,
      });
    }
  },

  // Get a single vendor by ID
  fetch: async function (req, res) {
    try {
      const id = req.params.id;
      const vendor = await vendorModel.findById(id).populate("company_id");

      if (!vendor) {
        return res
          .status(404)
          .json({ success: false, message: "Vendor not found" });
      }

      return res.json({ success: true, data: vendor });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message || error,
      });
    }
  },

  // Update a vendor
  update: async function (req, res) {
    try {
      const id = req.params.id;
      const updateData = req.body;

      const updatedVendor = await vendorModel.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedVendor) {
        return res
          .status(404)
          .json({ success: false, message: "Vendor not found" });
      }

      return res.json({ success: true, data: updatedVendor });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message || error,
      });
    }
  },

  // Get vendors by companyId
  findByCompanyId: async function (req, res) {
    try {
      const companyId = req.params.companyId;

      // Pagination params
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Optional search
      const search = req.query.search || "";

      // Build filter
      const filter = { company_id: companyId };

      if (search) {
        filter.$or = [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      // Count for pagination
      const total = await vendorModel.countDocuments(filter);

      // Fetch vendors
      const vendors = await vendorModel
        .find(filter)
        .populate("company_id")
        .skip(skip)
        .limit(limit)
        .exec();

      return res.json({
        success: true,
        data: vendors,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message || error,
      });
    }
  },

  // Delete a vendor
  delete: async function (req, res) {
    try {
      const id = req.params.id;

      const deletedVendor = await vendorModel.findByIdAndDelete(id);

      if (!deletedVendor) {
        return res
          .status(404)
          .json({ success: false, message: "Vendor not found" });
      }

      return res.json({
        success: true,
        message: "Vendor deleted successfully",
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

module.exports = vendorController;
