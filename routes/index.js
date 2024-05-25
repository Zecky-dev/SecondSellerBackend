const express = require("express");
const Router = express.Router();

const { getIndex } = require("../controllers/indexController");

Router.get("/", getIndex);

module.exports = Router;
