const express = require("express");
const Router = express.Router();

const {
  createAdvertisement,
  filterAdvertisements,
  getAllAdvertisements,
} = require("../controllers/advertisementController");

const authenticateToken = require("../middlewares/authorizationMiddleware.js");

// İlan rotaları için giriş yapma gereksinimi gerekliliği için kullanılan middleware
Router.use(authenticateToken);

// Bütün ilanları getirmek için kullanılır. (GET)
Router.get("/", getAllAdvertisements);

// Yeni bir ilan oluşturur ve ilanı oluşturan kullanıcının ilanlarına ekler. (POST)
Router.post("/create", createAdvertisement);

// Belirli kriterlere göre ilanları filtreler. (GET)
Router.get("/filter", filterAdvertisements);

module.exports = Router;
