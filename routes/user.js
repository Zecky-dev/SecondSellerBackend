const express = require("express");
const Router = express.Router();

const authenticateToken = require("../middlewares/authorizationMiddleware.js");


// User route'ları buraya eklenecek
const {
    register,
    getUser,
    sendEmailVerification
  } = require("../controllers/userController.js");

// Kullanıcı bilgilerini ID ile getirmek için kullanılır. (GET) 
Router.get("/:id", authenticateToken, getUser);

// Kullanıcı kaydı için kullanılır. (POST)
Router.post("/register", register);

// E-posta gönderimi için kullanılır. (POST)
Router.post("/sendEmailVerification", sendEmailVerification);


module.exports = Router;
