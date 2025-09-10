const productModel = require("../models/product_model");




const productControler = {
    createProduct: async function (req, res) {
        try {
                const data = req.body;
                const product = new productModel(data);
                await product.save();

                return res.json({ success: true, data:product, message: "Product Created Successfully"});  
            
        } catch (error) {
             return res.status(500).json({
                success: false,
                message: "Server Error",
                error: error.message || error
            });
            
        }
        
    },

    fetchProducts: async function (req, res) {
        try {
             const products = await productModel.aggregate([
                                        {
                                            $lookup: {
                                            from: "stockmanagements", // collection name (check in MongoDB)
                                            localField: "_id",
                                            foreignField: "product_id",
                                            as: "stock_details"
                                            }
                                        },
                                        {
                                            $unwind: { path: "$stock_details", preserveNullAndEmptyArrays: true }
                                        }
                                        ]);

            return res.json({ success: true, data:products});  
            
        } catch (error) {
             return res.status(500).json({
                success: false,
                message: "Server Error",
                error: error.message || error
            });
            
        }
        
    },

    fetchProduct: async function (req, res) {
        try {
            const id = req.params.id;
            const product = await productModel.findById(id);

            return res.json({ success: true, data:product});  
            
        } catch (error) {
             return res.status(500).json({
                success: false,
                message: "Server Error",
                error: error.message || error
            });
            
        }
        
    },

    fetchByCategory: async function (req, res) {
        try {
            const id = req.params.id;
            const products = await productModel.find({category_id: id});

            return res.json({ success: true, data:products});  
            
        } catch (error) {
             return res.status(500).json({
                success: false,
                message: "Server Error",
                error: error.message || error
            });
            
        }
        
    },

    delete: async function (req, res) {
        try {
        const id = req.params.id;

        const deletedStaff = await productModel.findByIdAndDelete(id);

        if (!deletedStaff) {
            return res
            .status(404)
            .json({ success: false, message: "product not found" });
        }

        return res.json({
            success: true,
            message: "product deleted successfully",
        });
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

            const updatedService = await productModel.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
            );

            if (!updatedService) {
            return res
                .status(404)
                .json({ success: false, message: "Product not found" });
            }

            return res.json({ success: true, data: updatedService });
        } catch (error) {
            return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message || error,
            });
        }
    },
}

module.exports =  productControler;