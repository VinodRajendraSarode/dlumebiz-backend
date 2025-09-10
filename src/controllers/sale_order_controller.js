const productModel = require("../models/product_model");
const StockManagementModel = require("../models/stock_management_model");
const SaleDetail = require("../models/sale_detail_model");
const SaleOrderModel = require("../models/sale_order_model");




const saleOrderControler = {
    create: async function (req, res) {
        try {
            const data = req.body;
            const details = data.details;
            const order = new SaleOrderModel(data);
            await order.save();

            if (Array.isArray(details) && details.length > 0) {
                let detailDocs = await SaleDetail.insertMany(
                    details.map(d => ({
                        ...d,
                        sales_order_id: order._id,
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
                    stock.out += qty; 
                    stock.total_stock -= qty; 
                    await stock.save();
                    } else {
                    await StockManagementModel.create({
                        product_id: d.product_id,
                        company_id: order.company_id,
                        in: qty,
                        total_stock: parseInt(previousStock) - qty,
                    });
                    }
                }
            }

            return res.json({ success: true, data:order, message: "Sale Order Created Successfully"});  
            
        } catch (error) {
             return res.status(500).json({
                success: false,
                message: "Server Error",
                error: error.message || error
            });
            
        }
        
    },

    fetch: async function (req, res) {
        try {
                const orders = await SaleOrderModel.find().populate('client_id');

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
            const order = await SaleOrderModel.findById(id);
             const details = await SaleDetail.find({ sales_order_id: id });

            return res.json({ success: true, data:order, details:details});  
            
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
            const orders = await SaleOrderModel.find({company_id: id});

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

        const deleted = await SaleOrderModel.findByIdAndDelete(id);

        if (!deleted) {
            return res
            .status(404)
            .json({ success: false, message: "Sale Order not found" });
        } else {
            if (deleted._id) {
                const details = await SaleDetail.find({ sales_order_id: id });

                  for (let d of details) {
                    const qty = parseInt(d.qty) || 0;

                    const stock = await StockManagementModel.findOne({
                        product_id: d.product_id,
                        company_id: deleted.company_id
                    });

                    if (stock) {
                        stock.out = parseInt(stock.out) - qty;
                        if (stock.out < 0) stock.out = 0;

                        stock.total_stock = parseInt(stock.total_stock) + qty;
                        if (stock.total_stock < 0) stock.total_stock = 0;

                        await stock.save();
                    }
                }
                await SaleDetail.deleteMany({ sales_order_id: id });
            }
            return res.status(200).json({ message: "Sale Order deleted successfully" });
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

            const updetedOrder = await SaleOrderModel.findByIdAndUpdate(
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
                .json({ success: false, message: "Sale Order not found" });
            }

            const old = await SaleDetail.find({ sales_order_id: id });

             for (let d of old) {
                const qty = parseInt(d.qty) || 0;

                const stock = await StockManagementModel.findOne({
                    product_id: d.product_id,
                    company_id: updetedOrder.company_id
                });

                if (stock) {
                    stock.out = parseInt(stock.out) - qty;
                    if (stock.out < 0) stock.out = 0;

                    stock.total_stock = parseInt(stock.total_stock) + qty;
                    if (stock.total_stock < 0) stock.total_stock = 0;

                    await stock.save();
                }
            }
            await SaleDetail.deleteMany({ sales_order_id: id });
             if (Array.isArray(details) && details.length > 0) {
                let detailDocs = await SaleDetail.insertMany(
                    details.map(d => ({
                        ...d,
                        sales_order_id: updetedOrder._id,
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
                    stock.out += qty; 
                    stock.total_stock -= qty; 
                    await stock.save();
                    } else {
                    await StockManagementModel.create({
                        product_id: d.product_id,
                        company_id: updetedOrder.company_id,
                        out: qty,
                        total_stock: parseInt(previousStock) - qty,
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

module.exports =  saleOrderControler;