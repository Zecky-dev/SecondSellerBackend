const express = require("express");
const Router = express.Router();

const authenticateToken = require("../middlewares/authorizationMiddleware.js");

// User route'ları buraya eklenecek
const {
  register,
  login,
  getUser,
  sendEmailVerification,
  favoriteUnfavorite,
  updateUser,
  changePassword,
  blockUser,
} = require("../controllers/userController.js");

// Kullanıcı bilgilerini ID ile getirmek için kullanılır. (GET)
Router.get("/:id", authenticateToken, getUser);

// Kullanıcı bilgilerini güncellemek için kullanılır. (PUT)
Router.put("/:id/updateUser", updateUser);

// Kullanıcının şifresini güncellemek için kullanılır. (PUT)
Router.put("/:id/changePassword", changePassword);

Router.put("/favoriteUnfavorite", favoriteUnfavorite);

// Bir kullanıcıyı block'lamak için kullanılır.
Router.put("/block", blockUser);

// Kullanıcı girişi için kullanılır.
Router.post("/login", login);

// Kullanıcı kaydı için kullanılır. (POST)
Router.post("/register", register);

// E-posta gönderimi için kullanılır. (POST)
Router.post("/sendEmailVerification", sendEmailVerification);

module.exports = Router;
