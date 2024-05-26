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
    const existingUser = await User.findOne({ emailAddress: userInfo.email });
    if (!existingUser) {
      const createdUser = await User.create(userInfo);
      const token = jwt.sign(
        { userId: createdUser._id },
        process.env.JWT_SECRET_TOKEN,
        { expiresIn: "24h" }
      );
      return res.status(201).json({
        status: "success",
        message: "User creation successful!",
        token,
      });
    } else {
      return res.status(409).json({
        status: "error",
        message: "User already exist",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.response.data,
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
          message: "Inactive user!",
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
          message: "Login successful!",
          token: jwtToken,
        });
      } else {
        return res.status(401).json({
          status: "error",
          message: "E-mail address or password is invalid!",
        });
      }
    } else {
      return res.status(401).json({
        status: "error",
        message: "E-mail address or password is invalid!",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while registering the user.",
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
        status: "Error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "User fetched successfully!",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "Error",
      message: "Error while fetching the user",
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
      message: "Verification email sent!",
      data: verificationCode,
    });
  } else {
    return res.status(500).json({
      status: "error",
      message: "User already exists!",
    });
  }
};

// Eğer ilan favoride değilse favoriye ekler, favoride ise favoriden çıkarır.
const favoriteUnfavorite = async (req, res) => {
  const { userID, advertisementID } = req.body;
  try {
    let user = await User.findById(userID);
    const userFavorites = user.favorites;
    if (userFavorites.includes(advertisementID)) {
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
      message: "Advertisement is added to favorites!",
      data: user.favorites,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error while favorite/unfavorite.",
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
    return res.status(200).json({
      status: "success",
      message: "User successfully updated.",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Internal server error!",
      error: err.message,
    });
  }
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userID = req.params.body;
  const saltRounds = 10;
  try {
    const user = await User.findById(userID);
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
        message: "Password change successful!",
        data: token,
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "Invalid password!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occurred while registering the user.",
      error: err.message,
    });
  }
};

const blockUser = async (req, res) => {
  const { id, from } = req.query;
  try {
    let user = await User.findById(from);
    const blockedUsers = user.blocked;
    if (blockedUsers.includes(id)) {
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
      message: "User blocked successfully!",
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: "Error while block",
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
};
