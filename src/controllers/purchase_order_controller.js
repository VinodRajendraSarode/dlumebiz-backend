const StockModel = require("../models/stock_model");
const productModel = require("../models/product_model");
const PurchaseDetail = require("../models/purchase_detail_model");
const PurchaseOrderModel = require("../models/purchase_order_model");
const StockManagementModel = require("../models/stock_management_model");


const purchaseOrderControler = {
    create: async function (req, res) {
            console.log(req.body);

        try {
            const data = req.body;
            console.log(data);
            const details = data.details;
            console.log(details);
            
            const order = new PurchaseOrderModel(data);
            await order.save();

            if (Array.isArray(details) && details.length > 0) {
                let detailDocs = await PurchaseDetail.insertMany(
                    details.map(d => ({
                        ...d,
                        purchase_order_id: order._id,
                    }))
                );

                for (let d of detailDocs) {
                    let stock = await StockManagementModel.findOne({
                    product_id: d.product_id,
                    company_id: order.company_id
                    });
                    const previousStock = stock ? stock.total_stock : 0;
                    const qty = parseInt(d.qty);
        
                    if (stock) {
                    stock.in += qty; 
                    stock.total_stock += qty; 
                    await stock.save();
                    } else {
                    await StockManagementModel.create({
                        product_id: d.product_id,
                        company_id: order.company_id,
                        in: qty,
                        total_stock: parseInt(previousStock) + qty,
                    });
                    }
                }
            }

            return res.json({ success: true, data:order, message: "Purchase Order Created Successfully"});  
            
        } catch (error) {
            console.log(error);

             return res.status(500).json({
                success: false,
                message: "Server Error",
                error: error.message || error
            });
            
        }
        
    },

    fetch: async function (req, res) {
        try {
                const orders = await PurchaseOrderModel.find().populate('vendor_id');

                return res.json({ success: true, data:orders});  
            
        } catch (error) {
             return res.status(500).json({
                success: false,
                message: "Server Error",
                error: error.message || error
            });
            
        }
        
    },

    fetchOrder: async function (req, res) {
        try {
            const id = req.params.id;
            const order = await PurchaseOrderModel.findById(id);
            const details = await PurchaseDetail.find({ purchase_order_id: id });

            return res.json({ success: true, order:order, details:details});  
            
        } catch (error) {
             return res.status(500).json({
                success: false,
                message: "Server Error",
                error: error.message || error
            });
            
        }
        
    },

    fetchByCompany: async function (req, res) {
        try {
            const id = req.params.id;
            const orders = await PurchaseOrderModel.find({company_id: id});

            return res.json({ success: true, data:orders});  
            
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

        const deleted = await PurchaseOrderModel.findByIdAndDelete(id);

        if (!deleted) {
            return res
            .status(404)
            .json({ success: false, message: "Purchase Order not found" });
        } else {
            if (deleted._id) {
                const details = await PurchaseDetail.find({ purchase_order_id: id });

                for (let d of details) {
                    const qty = parseInt(d.qty) || 0;

                    const stock = await StockManagementModel.findOne({
                        product_id: d.product_id,
                        company_id: deleted.company_id
                    });

                    if (stock) {
                        stock.in = parseInt(stock.in) - qty;
                        if (stock.in < 0) stock.in = 0;

                        stock.total_stock = parseInt(stock.total_stock) - qty;
                        if (stock.total_stock < 0) stock.total_stock = 0;

                        await stock.save();
                    }
                }

                await PurchaseDetail.deleteMany({ purchase_order_id: id });
            }
            return res.status(200).json({ message: "Purchase Order deleted successfully" });
        }     

       
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
            const details = updateData.details;

            const updetedOrder = await PurchaseOrderModel.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
            );

            if (!updetedOrder) {
            return res
                .status(404)
                .json({ success: false, message: "Purchase Order not found" });
            }   
                const old = await PurchaseDetail.find({ purchase_order_id: id });

                for (let d of old) {
                    const qty = parseInt(d.qty) || 0;

                    const stock = await StockManagementModel.findOne({
                        product_id: d.product_id,
                        company_id: updetedOrder.company_id
                    });

                    if (stock) {
                        stock.in = parseInt(stock.in) - qty;
                        if (stock.in < 0) stock.in = 0;

                        stock.total_stock = parseInt(stock.total_stock) - qty;
                        if (stock.total_stock < 0) stock.total_stock = 0;

                        await stock.save();
                    }
                }
                await PurchaseDetail.deleteMany({ purchase_order_id: id });
                if (Array.isArray(details) && details.length > 0) {
                    let detailDocs = await PurchaseDetail.insertMany(
                        details.map(d => ({
                            ...d,
                            purchase_order_id: updetedOrder._id,
                        }))
                    );

                    for (let d of detailDocs) {
                        let stock = await StockManagementModel.findOne({
                        product_id: d.product_id,
                        company_id: updetedOrder.company_id
                        });
                        const previousStock = stock ? stock.total_stock : 0;
                        const qty = parseInt(d.qty);
            
                        if (stock) {
                        stock.in += qty; 
                        stock.total_stock += qty; 
                        await stock.save();
                        } else {
                        await StockManagementModel.create({
                            product_id: d.product_id,
                            company_id: updetedOrder.company_id,
                            in: qty,
                            total_stock: parseInt(previousStock) + qty,
                        });
                        }
                    }
                }

      

            return res.json({ success: true, data: updetedOrder });
        } catch (error) {
            return res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message || error,
            });
        }
    },
}

module.exports =  purchaseOrderControler;