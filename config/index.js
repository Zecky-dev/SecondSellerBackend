require("dotenv").config();

const {
  MONGODB_URI_LOCAL : MONGODB_URI,
  PORT,
  SECRET_ACCESS_TOKEN,
  JWT_SECRET_TOKEN,
} = process.env;

module.exports = {
  MONGODB_URI,
  PORT,
  SECRET_ACCESS_TOKEN,
  JWT_SECRET_TOKEN,
};
