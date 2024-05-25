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





  module.exports = {
    register,
    getUser,
    sendEmailVerification
  }
