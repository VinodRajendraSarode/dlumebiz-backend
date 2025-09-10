require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const cors  = require("cors");
const mongoose  = require("mongoose");
const userRouter = require("./routes/user_router");
const categoryRouter = require("./routes/category_router");
const productRouter = require("./routes/product_router");
const companyRouter = require("./routes/company_router");
const staffRouter = require('./routes/staff_router');
const clientRouter = require('./routes/client_router');
const serviceRouter = require('./routes/service_routes');
const orderRouter = require('./routes/order_routes');
const stockRouter = require('./routes/stock_routes');
const stockManagementRouter = require('./routes/stock_management_routes');
const vendorRouter = require('./routes/vendor_router');
const purchaseRouter = require('./routes/purchase_route');
const salesRouter = require('./routes/sales_route');
const reportRouter = require('./routes/report_router');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(helmet());
app.use(morgan('dev'));
app.use(cors());

const upload = multer();

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

app.get("/", function(req, res){
    res.send("hello world");
});

// Routes

const nocache = (req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
};

app.use(
  "/api",
  nocache,
  upload.none(),
  userRouter,
  categoryRouter,
  productRouter,
  companyRouter,
  staffRouter,
  clientRouter,
  serviceRouter,
  orderRouter,
  stockRouter,
  stockManagementRouter,
  vendorRouter,
  purchaseRouter,
  salesRouter,
  reportRouter
);


// Routes


const PORT = process.env.PORT || 8000;  
app.listen(PORT, () => console.log("Server started at port: 8000"));