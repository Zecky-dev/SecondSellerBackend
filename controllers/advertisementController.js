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
    const filteredAdvertisements = await Advertisement.find(filter)
      .sort(sort)
      .exec();
    return res.status(201).json({
      status: "success",
      message: "Filtered advertisements are fetched successfully!",
      data: filteredAdvertisements,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while filtering advertisements!",
      error: err.response.data,
    });
  }
};

// ID'si verilen ilanı günceller, güncel halini döndürür
const updateAdvertisement = async (req, res) => {
  try {
    const advertisementID = req.params.id;
    const updatedAdvertisement = await Advertisement.findByIdAndUpdate(
      advertisementID,
      req.body,
      { new: true }
    );

    if (!updatedAdvertisement) {
      return res.status(404).json({
        status: "error",
        message: "Advertisement not found!",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Advertisement updated successfully!",
      data: updatedAdvertisement,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error!",
      error: err.message,
    });
  }
};

// ID'si verilen ilanı siler
const removeAdvertisement = async (req, res) => {
  try {
    const advertisementID = req.query.id;
    const deletedAdvertisement = await Advertisement.findByIdAndDelete(
      advertisementID
    );
    if (!deletedAdvertisement) {
      return res.status(404).json({
        status: "error",
        message: "Advertisement not found!",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Advertisement deleted successfully!",
      data: deletedAdvertisement,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error!",
      error: err.message,
    });
  }
};

const getAllAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.find({});
    return res.status(200).json({
      status: "success",
      message: "All advertisements fetched successfully!",
      data: advertisements,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error!",
      error: err.message,
    });
  }
};

module.exports = {
  createAdvertisement,
  updateAdvertisement,
  filterAdvertisements,
  removeAdvertisement,
  getAllAdvertisements,
};
