const mongoose = require('mongoose')

const { MONGODB_URI } = require('../config/index.js')

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI)
        console.log("MongoDB connection is successful!")
    }
    catch(err) {
        console.log("MongoDB connection FAILED!",err)
        process.exit(0);
    }
}


module.exports = { connectDB }