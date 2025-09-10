const clientModel = require("../models/client_model");

const clientController = {
  // Get all clients
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
      const total = await clientModel.countDocuments(filter);

      // Fetch filtered and paginated clients
      const clients = await clientModel
        .find(filter)
        .populate("company_id")
        .skip(skip)
        .limit(limit)
        .exec();

      return res.json({
        success: true,
        data: clients,
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

  // Create a new client
  create: async function (req, res) {
    try {
      const data = req.body;
      const client = new clientModel(data);
      await client.save();

      return res.json({
        success: true,
        data: client,
        message: "Client Created Successfully",
      });
    } catch (error) {
      console.log(error)
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message || error,
      });
    }
  },

  // Get a single client by ID
  fetch: async function (req, res) {
    try {
      const id = req.params.id;
      const client = await clientModel.findById(id).populate("company_id");

      if (!client) {
        return res
          .status(404)
          .json({ success: false, message: "Client not found" });
      }

      return res.json({ success: true, data: client });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message || error,
      });
    }
  },

  // Update a client
  update: async function (req, res) {
    try {
      const id = req.params.id;
      const updateData = req.body;

      const updatedClient = await clientModel.findByIdAndUpdate(
        id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedClient) {
        return res
          .status(404)
          .json({ success: false, message: "Client not found" });
      }

      return res.json({ success: true, data: updatedClient });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error: error.message || error,
      });
    }
  },

  findByCompanyId: async function (req, res) {
    try {
      const companyId = req.params.companyId;

      // Pagination params: page and limit, with defaults
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      // Optional filter (e.g., search by client name or email)
      const search = req.query.search || "";

      // Build filter object
      const filter = {
        company_id: companyId,
      };

      if (search) {
        // Filter by name or email containing the search text (case-insensitive)
        filter.$or = [
          { fullName: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ];
      }

      // Get total count for pagination
      const total = await clientModel.countDocuments(filter);

      // Fetch clients with pagination and filter
      const clients = await clientModel
        .find(filter)
        .populate("company_id")
        .skip(skip)
        .limit(limit)
        .exec();

      return res.json({
        success: true,
        data: clients,
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

  // Delete a client
  delete: async function (req, res) {
    try {
      const id = req.params.id;

      const deletedClient = await clientModel.findByIdAndDelete(id);

      if (!deletedClient) {
        return res
          .status(404)
          .json({ success: false, message: "Client not found" });
      }

      return res.json({
        success: true,
        message: "Client deleted successfully",
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

module.exports = clientController;
