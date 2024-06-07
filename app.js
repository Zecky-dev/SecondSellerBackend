// Packages
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const opn = require('opn');
const swaggerDocs = require('./swagger.js')


// Configs
const { PORT } = require("./config/index.js");

const { connectDB } = require("./database/db.js");

// Routes
const IndexRoute = require("./routes/index.js");
const UserRoutes = require("./routes/user.js");
const AdvertisementRoutes = require("./routes/advertisement.js");


const app = express();

// Middlewares
app.disable("x-powered-by");
app.use(cors({ origin: "http://localhost:3000" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route middlewares
app.use("/", IndexRoute);
app.use("/user", UserRoutes);
app.use("/advertisements", AdvertisementRoutes);

// Veritabanı bağlantısı
// Middleware tanımlamalarından sonra
connectDB();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is listening  on port ${PORT}`);
  swaggerDocs(app,PORT)
  opn(`http://localhost:${PORT}/docs`)
});
