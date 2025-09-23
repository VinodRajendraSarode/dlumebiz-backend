const PdfPrinter = require("pdfmake");
const path = require("path");
const OrderModel = require("../models/order_model");
const StockManagementModel = require("../models/stock_management_model");
const productModel = require("../models/product_model");
const SaleDetail = require("../models/sale_detail_model");
const SaleOrderModel = require("../models/sale_order_model");
const PurchaseDetail = require("../models/purchase_detail_model");
const PurchaseOrderModel = require("../models/purchase_order_model");

const fonts = {
  Roboto: {
    normal: path.join(__dirname, "../fonts/static/Roboto-Regular.ttf"),
    bold: path.join(__dirname, "../fonts/static/Roboto-Medium.ttf"),
    italics: path.join(__dirname, "../fonts/static/Roboto-Italic.ttf"),
    bolditalics: path.join(__dirname, "../fonts/static/Roboto-MediumItalic.ttf"),
  },
};

const printer = new PdfPrinter(fonts);
const reportController = {
  salesReport: async (req, res) => {
    try {
      const orders = await SaleOrderModel.find().populate("client_id");

      // Table body
     const body = [
              [
                { text: "Invoice No", style: "tableHeader" },
                { text: "Client", style: "tableHeader" },
                { text: "Date", style: "tableHeader" },
                { text: "Amount Before Tax", style: "tableHeader" },
                { text: "CGST", style: "tableHeader" },
                { text: "SGST", style: "tableHeader" },
                { text: "IGST", style: "tableHeader" },
                { text: "Total", style: "tableHeader" },
              ],
              ...orders.map((o) => [
                { text: o.invoice_no || "" },
                { text: `${o.client_id?.first_name || ""} ${o.client_id?.last_name || ""}` },
                { text: new Date(o.order_date).toLocaleDateString() || "" },
                { text: o.amount_befor_tax || "" },
                { text: o.cgst || "" },
                { text: o.sgst || "" },
                { text: o.igst || "" },
                { text: o.discounted_amount || "" },
              ]),
            ];


      const docDefinition = {
        content: [
          { text: "Sales Report", style: "header" },
          {
            style: "tableExample",
            table: {
              headerRows: 1,
              widths: ["auto", "*", "auto", "auto", "auto", "auto", "auto", "auto"],
              body
            },
            layout: {
              hLineWidth: function (i, node) {
                return 1; // horizontal line width
              },
              vLineWidth: function (i, node) {
                return 1; // vertical line width
              },
              hLineColor: function (i, node) {
                return "black"; // horizontal line color
              },
              vLineColor: function (i, node) {
                return "black"; // vertical line color
              },
              paddingLeft: function (i, node) { return 5; },
              paddingRight: function (i, node) { return 5; },
              paddingTop: function (i, node) { return 3; },
              paddingBottom: function (i, node) { return 3; },
            }
          },
        ],
        styles: {
          header: { fontSize: 18, bold: true, alignment: "center", margin: [0, 0, 0, 20] },
          tableHeader: { bold: true, fillColor: "#E5E5E5" },
        },
        defaultStyle: { fontSize: 10 },
      };

      const pdfDoc = printer.createPdfKitDocument(docDefinition);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=sales_report.pdf");

      pdfDoc.pipe(res);
      pdfDoc.end();
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
  },


  purchaseReport: async (req, res) => {
    try {
    const orders = await PurchaseOrderModel.find().populate("vendor_id");

    // Helper to safely create table cells
    const safeCell = (val) => ({ text: val || "" });

    // Table body
    const body = [
      [
        { text: "Order No", style: "tableHeader" },
        { text: "Vendor", style: "tableHeader" },
        { text: "Date", style: "tableHeader" },
        { text: "Amount Before Tax", style: "tableHeader" },
        { text: "CGST", style: "tableHeader" },
        { text: "SGST", style: "tableHeader" },
        { text: "IGST", style: "tableHeader" },
        { text: "Total", style: "tableHeader" },
      ],
      ...orders.map((o) => [
        safeCell(o.order_no),
        safeCell(`${o.vendor_id?.first_name || ""} ${o.vendor_id?.last_name || ""}`),
        safeCell(new Date(o.order_date).toLocaleDateString()),
        safeCell(o.amount_befor_tax),
        safeCell(o.cgst),
        safeCell(o.sgst),
        safeCell(o.igst),
        safeCell(o.discounted_amount),
      ]),
    ];

    const docDefinition = {
      content: [
        { text: "Purchase Report", style: "header" },
        {
          style: "tableExample",
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto", "auto", "auto", "auto", "auto", "auto"],
            body,
          },
          layout: {
            hLineWidth: () => 1,
            vLineWidth: () => 1,
            hLineColor: () => "black",
            vLineColor: () => "black",
            paddingLeft: () => 5,
            paddingRight: () => 5,
            paddingTop: () => 3,
            paddingBottom: () => 3,
          },
        },
      ],
      styles: {
        header: { fontSize: 18, bold: true, alignment: "center", margin: [0, 0, 0, 20] },
        tableHeader: { bold: true, fillColor: "#E5E5E5" },
      },
      defaultStyle: { fontSize: 10 },
      footer: function (currentPage, pageCount) {
        return {
          text:
            "Office No. 47, D'Lume, Mass Metropolis, near Maharashtra Dosti brass, Kurla signal, Chembur, Mumbai, Maharashtra 400071\n" +
            "Website: www.dlume.com | Email: info@dlume.com | Phone: +91 8850677939",
          alignment: "center",
          fontSize: 8,
          margin: [0, 20, 0, 0],
        };
      },
    };

    const pdfDoc = printer.createPdfKitDocument(docDefinition);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=purchase_report.pdf");

    pdfDoc.pipe(res);
    pdfDoc.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
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
