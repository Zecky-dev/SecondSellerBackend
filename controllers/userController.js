const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { sendVerificationEmail } = require("../utils/sendVerificationEmail.js");

// UserController fonksiyonları eklenecek
const register = async (req, res) => {
  const { password } = req.body;
  const saltRounds = 10;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userInfo = { ...req.body, password: hashedPassword };
    const existingUser = await User.findOne({
      $or: [
        { emailAddress: userInfo.emailAddress },
        { phoneNumber: userInfo.phoneNumber },
      ],
    });
    if (!existingUser) {
      const createdUser = await User.create(userInfo);
      const token = jwt.sign(
        { userId: createdUser._id },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: "24h" }
      );
      return res.status(201).json({
        status: "success",
        message: "Kullanıcı oluşturuldu!",
        token,
      });
    } else {
      return res.status(409).json({
        status: "error",
        message: "Kullanıcı zaten mevcut",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Kullanıcı oluşturulurken bir hata meudana geldi!",
      error: err.response.data,
    });
  }
};

// E-posta ve şifre kullanarak giriş işlemi yapar, kullanıcı id'sini kullanarak bir jwt tokeni üretir ve giriş ile birlikte o tokeni döndürür
const login = async (req, res) => {
  try {
    const { emailAddress, password } = req.body;
    const user = await User.findOne({ emailAddress });
    if (user) {
      if (!user.activeStatus) {
        return res.status(401).json({
          status: "error",
          message: "Aktif olmayan kullanıcı!",
        });
      }
      const passwordValid = await bcrypt.compare(password, user.password);
      if (passwordValid) {
        const jwtToken = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET_TOKEN,
          { expiresIn: "24h" }
        );
        return res.status(200).json({
          status: "success",
          message: "Giriş başarılı!",
          token: jwtToken,
        });
      } else {
        return res.status(401).json({
          status: "error",
          message: "E-posta adresi veya şifre hatalı!",
        });
      }
    } else {
      return res.status(401).json({
        status: "error",
        message: "E-posta adresi veya şifre hatalı!",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Giriş yaparken bir hata meydana geldi.",
      error: err.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const userID = req.params.id;
    const user = await User.findById(userID);
    // Eğer user null ise, 404 Not Found yanıtı döndür
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Kullanıcı bulunamadı!",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Kullanıcı getirildi!",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Kullanıcı getirilirken hata meydana geldi!",
      error: err.message,
    });
  }
};

// Kayıtta ve şifre güncellemede kullanıcıya gerekli doğrulama e-postasını gönderir.
// 6 haneli bir kod oluşturur ve bunu cevap olarak döner.
const sendEmailVerification = async (req, res) => {
  const { emailAddress, phoneNumber, type } = req.body;
  let filters;

  if (type === "phoneNumberUpdate") {
    filters = [{ phoneNumber }];
  } else if (type === "emailAddressUpdate") {
    filters = [{ emailAddress }];
  } else {
    filters = [{ emailAddress }, { phoneNumber }];
  }
  userExists = await User.findOne({
    $or: filters,
  });
  if (!userExists) {
    const verificationCode = await sendVerificationEmail(emailAddress);
    return res.status(200).json({
      status: "success",
      message: "Doğrulama e-posta'sı gönderildi!",
      data: verificationCode,
    });
  } else {
    return res.status(500).json({
      status: "error",
      message: "Kullanıcı zaten kayıtlı!",
    });
  }
};

// Eğer ilan favoride değilse favoriye ekler, favoride ise favoriden çıkarır.
const favoriteUnfavorite = async (req, res) => {
  const { userID, advertisementID } = req.body;
  try {
    let user = await User.findById(userID);
    const isInclude = user.favorites.includes(advertisementID);
    if (isInclude) {
      user = await User.findByIdAndUpdate(
        userID,
        { $pull: { favorites: advertisementID } },
        { returnDocument: "after" }
      );
    } else {
      user = await User.findByIdAndUpdate(
        userID,
        { $push: { favorites: advertisementID } },
        { returnDocument: "after" }
      );
    }
    return res.status(200).json({
      status: "success",
      message: isInclude
        ? "İlan favorilerden kaldırıldı!"
        : "İlan favorilerden kaldırıldı!",
      data: user.favorites,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: `İlan ${
        isInclude ? "favorilerden kaldırılırken" : "favorilere eklenirken"
      } hata meydana geldi!`,
      error: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const userID = req.params.id;
    const updatedUser = await User.findByIdAndUpdate(userID, req.body, {
      returnDocument: "after",
    });

    if (!updateUser) {
      return res.status(200).json({
        status: "error",
        message: "Kullanıcı bulunamadı.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Kullanıcı güncellendi.",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Sunucu hatası!",
      error: err.message,
    });
  }
};

const updatePassword = async (req, res) => {
  const { newPassword, emailAddress } = req.body;

  const saltRounds = 10;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    const updatedUser = await User.findOneAndUpdate(
      { emailAddress },
      { password: hashedPassword },
      {
        returnDocument: "after",
      }
    );

    if (!updatedUser) {
      return res.status(200).json({
        status: "error",
        message: "Kullanıcı bulunamadı!",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Şifre güncellendi!",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Şifre güncellenirken bir hata meydana geldi!",
      error: err.message,
    });
  }
};

const passwordReset = async (req, res) => {
  const { emailAddress } = req.query;
  try {
    const user = await User.findOne({ emailAddress });
    if (user) {
      const verificationCode = await sendResetPasswordEmail(emailAddress);
      const resetCode = {
        data: verificationCode,
      };
      return res.status(200).json({
        status: "success",
        message: "Şifre sıfırlama e-posta'sı gönderildi!",
        data: resetCode.data,
      });
    } else {
      return res.status(404).json({
        status: "error",
        message: "Kullanıcı bulunamadı!",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Şifre sırıflama sırasında hata meydana geldi.",
      error: err.message,
    });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userID = req.params.id;
  const saltRounds = 10;
  try {
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Kullanıcı bulunamadı!",
      });
    }
    const passwordValid = await bcrypt.compare(oldPassword, user.password);
    if (passwordValid) {
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      await User.findByIdAndUpdate(
        userID,
        { password: hashedPassword },
        {
          returnDocument: "after",
        }
      );
      const token = jwt.sign({ userId: userID }, process.env.JWT_SECRET_TOKEN, {
        expiresIn: "24h",
      });
      return res.status(200).json({
        status: "success",
        message: "Şifre değiştirme başarılı!",
        data: token,
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "Geçersiz şifre!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Şifre değiştirilirken bir hata meydana geldi.",
      error: err.message,
    });
  }
};

const blockUser = async (req, res) => {
  const { id, from } = req.query;
  try {
    let user = await User.findById(from);
    const isInclude = user.blocked.includes(id);
    if (isInclude) {
      user = await User.findByIdAndUpdate(
        from,
        { $pull: { blocked: id } },
        { returnDocument: "after" }
      );
    } else {
      user = await User.findByIdAndUpdate(
        from,
        { $push: { blocked: id } },
        { returnDocument: "after" }
      );
    }
    return res.status(200).json({
      status: "success",
      message: isInclude
        ? "Kullanıcının engeli kaldırıldı!"
        : "Kullanıcı engellendi!",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Engelleme sırasında hata meydana geldi!",
      error: err.message,
    });
  }
};

module.exports = {
  register,
  login,
  getUser,
  sendEmailVerification,
  favoriteUnfavorite,
  updateUser,
  changePassword,
  blockUser,
  passwordReset,
  updatePassword,
};
