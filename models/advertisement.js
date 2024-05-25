const mongoose = require("mongoose");

const { Schema } = mongoose;
const LocationSchema = require("../models/sub_schemas/location.js");

const AdvertisementSchema = new Schema({
  createDate: {
    type: Date,
    default: new Date(),
  },

  title: {
    type: String,
    required: [true, "You must pass a title"],
    trim: true,
  },

  description: {
    type: String,
    required: [true, "You must pass description"],
    trim: true,
  },

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Owner is required!"],
  },

  price: {
    type: Number,
    required: [true, "You must pass a price value"],
    min: [1, "You must pass an positive integer value"],
  },

  location: {
    type: LocationSchema,
    required: [true, "Location is required!"],
  },

  category: {
    type: String,
    required: [true, "You must pass a category"],
    default: "default",
  },

  soldStatus: {
    type: Boolean,
    default: false,
  },

  images: {
    type: [String],
    required: [true, "Images are required!"],
  },
});

const Advertisement = mongoose.model("Advertisement", AdvertisementSchema);

module.exports = Advertisement;
