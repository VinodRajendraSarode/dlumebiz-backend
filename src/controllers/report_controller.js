const puppeteer = require("puppeteer");
const OrderModel = require("../models/order_model");
const StockManagementModel = require("../models/stock_management_model");
const productModel = require("../models/product_model");
const SaleDetail = require("../models/sale_detail_model");
const SaleOrderModel = require("../models/sale_order_model");
const PurchaseDetail = require("../models/purchase_detail_model");
const PurchaseOrderModel = require("../models/purchase_order_model");
const reportController = {
  salesReport: async (req, res) => {
    try {
      const orders = await SaleOrderModel.find().populate('client_id');
       const browser = await puppeteer.launch();
       const page = await browser.newPage();

      // Load HTML content
       // Generate HTML dynamically from orders
    let htmlContent = `
      <h1 style="color: black; text-align: center;">Sales Report</h1>
      <table border="1" cellspacing="0" cellpadding="5">
        <tr>
          <th>Invoice No</th>
          <th>Client</th>
          <th>Date</th>
          <th>Amount Befor Tax</th>
          <th>CGST</th>
          <th>SGST</th>
          <th>IGST</th>
          <th>Total</th>
        </tr>
        ${orders
          .map(
            (o) => `
          <tr>
            <td>${o.invoice_no}</td>
             <td>${new Date(o.order_date).toLocaleDateString()}</td>
            <td>${o.client_id?.first_name || " "} ${o.client_id?.last_name || " "}</td>           
            <td>${o.amount_befor_tax}</td>
            <td>${o.cgst}</td>
            <td>${o.sgst}</td>
            <td>${o.igst}</td>
            <td>${o.discounted_amount}</td>
          </tr>
        `
          )
          .join("")}
      </table>
    `;

    await page.setContent(htmlContent);

    // Generate PDF as Buffer
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    // Send PDF back
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=sales_report.pdf",
      "Content-Length": pdfBuffer.length,
    });

    return res.send(pdfBuffer);
    } catch (error) {
        console.log(error);
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  },

  purchaseReport: async (req, res) => {
    try {
       const orders = await PurchaseOrderModel.find().populate('vendor_id');

     const browser = await puppeteer.launch();
       const page = await browser.newPage();

      // Load HTML content
       // Generate HTML dynamically from orders
    let htmlContent = `
      <h1 style="color: black; text-align: center;">Purchase Report</h1>
      <table border="1" cellspacing="0" cellpadding="5">
        <tr>
          <th>Order No</th>
          <th>Client</th>
          <th>Date</th>
          <th>Amount Befor Tax</th>
          <th>CGST</th>
          <th>SGST</th>
          <th>IGST</th>
          <th>Total</th>
        </tr>
        ${orders
          .map(
            (o) => `
          <tr>
            <td>${o.order_no}</td>
            <td>${new Date(o.order_date).toLocaleDateString()}</td>
            <td>${o.vendor_id?.first_name || " "} ${o.vendor_id?.last_name || " "}</td>           
            <td>${o.amount_befor_tax}</td>
            <td>${o.cgst}</td>
            <td>${o.sgst}</td>
            <td>${o.igst}</td>
            <td>${o.discounted_amount}</td>
          </tr>
        `
          )
          .join("")}
      </table>
    `;

    await page.setContent(htmlContent);

    // Generate PDF as Buffer
    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    // Send PDF back
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=sales_report.pdf",
      "Content-Length": pdfBuffer.length,
    });

    return res.send(pdfBuffer);
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  },

  stockReport: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const orders = await OrderModel.find({})
        .populate("client_id service_ids company_id")
        .skip(skip)
        .limit(limit);

      const total = await OrderModel.countDocuments();
      return res.json({
        success: true,
        data: orders,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  },

  lowStock: async (req, res) => {
    try {
      const companyId = req.params.companyId;
      
      const page = parseInt(req.query.page) || 1;
      console.log("page");
      console.log(page);
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const orders = await OrderModel.find({ company_id: companyId })
        .populate("client_id service_id")
        .skip(skip)
        .limit(limit);

      const total = await OrderModel.countDocuments({ company_id: companyId });

      return res.json({
        success: true,
        data: orders,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  },

  balancesheet: async (req, res) => {
    try {
      const updatedOrder = await OrderModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!updatedOrder) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }
      return res.json({ success: true, data: updatedOrder });
    } catch (error) {
      return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  },


};

module.exports = reportController;
