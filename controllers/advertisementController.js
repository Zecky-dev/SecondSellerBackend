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
      message: "İlan oluşturuldu!",
      data: newAdvertisement,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası!",
      error: err.message,
    });
  }
};

// Kullanıcının ID'sine bağlı olan ilanları getirir
const getAdvertisementsByUserID = async (req, res) => {
  try {
    const userID = req.query.id;
    const user = await User.findById(userID);
    const userPosts = user.advertisements;
    const favoriteAdvertisementIDs = user.favorites;
    const ownAdvertisements = await Advertisement.find({
      _id: { $in: userPosts },
    });
    const favoriteAdvertisements = await Advertisement.find({
      _id: { $in: favoriteAdvertisementIDs },
    });
    return res.status(200).json({
      status: "success",
      message: "Kullanıcı ilanları getirildi!",
      data: {
        ownAdvertisements,
        favoriteAdvertisements,
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası!",
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
    return res.status(200).json({
      status: "success",
      message: "Filtrelenmiş ilanlar getirildi!",
      data: filteredAdvertisements,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "İlanlar filtrelenirken bir hata meydana geldi!",
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
        message: "İlan bulunamadı!",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "İlan güncellendi!",
      data: updatedAdvertisement,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası!",
      error: err.message,
    });
  }
};

const getAdvertisement = async (req, res) => {
  try {
    const advertisementID = req.params.id;
    const advertisement = await Advertisement.findById(advertisementID);
    if (!advertisement) {
      return res.status(404).json({
        status: "error",
        message: "İlan bulunamadı!",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "İlan getirildi!",
      data: advertisement,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası!",
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
        message: "İlan bulunamadı!",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "İlan silindi!",
      data: deletedAdvertisement,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası!",
      error: err.message,
    });
  }
};

const getAllAdvertisements = async (req, res) => {
  try {
    const advertisements = await Advertisement.find({});
    return res.status(200).json({
      status: "success",
      message: "Bütün ilanlar getirildi!",
      data: advertisements,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası!",
      error: err.message,
    });
  }
};

module.exports = {
  getAdvertisement,
  createAdvertisement,
  updateAdvertisement,
  filterAdvertisements,
  removeAdvertisement,
  getAllAdvertisements,
  getAdvertisementsByUserID,
};
