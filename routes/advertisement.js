const express = require("express");
const Router = express.Router();

// Middlewares
const validationMiddleWare = require("../middlewares/validationMiddleware");
const { advertisementSchema } = require("../utils/validation/schemas.js");
const authenticateToken = require("../middlewares/authorizationMiddleware.js");

// İlan rotaları için giriş yapma gereksinimi gerekliliği için kullanılan middleware
Router.use(authenticateToken);

// Advertisement Controller fonksiyonları buraya yazılacak
