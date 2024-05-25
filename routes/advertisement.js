const express = require("express");
const Router = express.Router();

const {
  createAdvertisement,
  filterAdvertisements,
  updateAdvertisement,
  removeAdvertisement

} = require("../controllers/advertisementController");

const validationMiddleWare = require("../middlewares/validationMiddleware");
const { advertisementSchema } = require("../utils/validation/schemas.js");

const authenticateToken = require("../middlewares/authorizationMiddleware.js");

// İlan rotaları için giriş yapma gereksinimi gerekliliği için kullanılan middleware
Router.use(authenticateToken);

// Yeni bir ilan oluşturur ve ilanı oluşturan kullanıcının ilanlarına ekler. (POST)
Router.post(
    "/create",
    validationMiddleWare(advertisementSchema),
    createAdvertisement
  );

// Belirli kriterlere göre ilanları filtreler. (GET) 
Router.get('/filter', filterAdvertisements)

// ID'si verilen ilanı günceller ve güncellenmiş halini döndürür. (PUT)
Router.put(
  "/:id",
  updateAdvertisement
);

// Belirlenen ilan ID'sine sahip olan ilanı siler. (DELETE)
Router.delete("/remove", removeAdvertisement);



module.exports = Router;
