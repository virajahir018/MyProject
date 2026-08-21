const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/project")
        console.log("connected")
    } catch (error) {
        console.log("not connected")
        console.log(error)
    }
}

module.exports = connectDB;