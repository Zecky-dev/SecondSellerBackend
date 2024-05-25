const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  nameSurname: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
  },

  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  activeStatus: {
    type: Boolean,
    default: true,
  },

  password: {
    type: String,
    trim: true,
  },

  emailAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  createDate: {
    type: Date,
    default: new Date(),
  },

  imageURL: {
    type: String,
    default: "",
  },

  favorites: {
    type: [String],
    default: [],
  },

  advertisements: {
    type: [String],
    default: [],
  },

  messageRooms: {
    type: [String],
    default: [],
  },

  blocked: {
    type: [String],
    default: [],
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = { UserSchema };

module.exports = User;
