const mongoose = require("mongoose");
const { Schema } = mongoose;

const LocationSchema = new Schema({
  latitude: {
    type: Number,
    required: [true, "Location latitude is required!"],
  },
  longitude: {
    type: Number,
    required: [true, "Location longitude is required!"],
  },
});

module.exports = LocationSchema;
