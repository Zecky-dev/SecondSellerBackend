const express = require("express");
const Router = express.Router();

const validationMiddleware = require("../middlewares/validationMiddleware.js");
const {
  registerSchema,
} = require("../utils/validation/schemas.js");

// User route'ları buraya eklenecek
const {
    register,
    getUser,
  } = require("../controllers/userController.js");

// Kullanıcı bilgilerini ID ile getirmek için kullanılır. (GET) 
Router.get("/:id", authenticateToken, getUser);

// Kullanıcı kaydı için kullanılır. (POST)
Router.post("/register", validationMiddleware(registerSchema), register);



module.exports = Router;
