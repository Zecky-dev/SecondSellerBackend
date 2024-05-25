const axios = require("axios");

const Advertisement = require("../models/advertisement.js");
const User = require("../models/user.js");

// Advertisement Controller fonksiyonları buraya eklenecek.

const createAdvertisement = async (req, res) => {
    try {
      const newAdvertisement = await Advertisement.create(req.body);
      const newAdvertisementID = newAdvertisement.id;
      const postOwnerID = newAdvertisement.owner;
      await User.findByIdAndUpdate(postOwnerID, {
        $push: { advertisements: newAdvertisementID },
      });
      return res.status(201).json({
        status: "success",
        message: "Advertisement created successfully!",
        data: newAdvertisement,
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "Internal server error!",
        error: err.message,
      });
    }
  };

  const filterAdvertisements = async (req, res) => {
    try {
      const queryParameters = req.query;
      const filter = {};
  
      // Fiyat aralığı kontrolü
      const priceMin = parseInt(queryParameters.price_min);
      const priceMax = parseInt(queryParameters.price_max);
      if (!isNaN(priceMin)) {
        filter.price = { $gte: priceMin };
      }
      if (!isNaN(priceMax)) {
        filter.price = { ...filter.price, $lte: priceMax }; // Eğer priceMin da verilmişse, aynı objenin içine $lte de eklenmeli
      }
  
      // Kategori kontrolü
      const category = queryParameters.category;
      if (category && category !== "default") {
        filter.category = category;
      }
  
      // Kategori kontrolü
      const title = queryParameters.title;
      if (title && title !== "") {
        filter.title = { $regex: title, $options: "i" };
      }
  
      // Mongoose sort objesi
      const sort = {};
      for (let query in queryParameters) {
        const val = queryParameters[query];
        if (query === "price" || query === "date") {
          sort[query] = val === "ascending" ? 1 : -1;
        }
      }
      const filteredAdvertisements = await Advertisement.find(filter).sort(sort).exec();
      return res.status(201).json({
        status: "success",
        message: "Filtered advertisements are fetched successfully!",
        data: filteredAdvertisements
      })
  
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: "An error occurred while filtering advertisements!",
        error: err.response.data
      })
    }
  };
  

  module.exports = {
    createAdvertisement,
    filterAdvertisements
  };
  
