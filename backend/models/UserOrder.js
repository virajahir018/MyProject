const mongoose = require("mongoose");

const userorderSchema = new mongoose.Schema({
    
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }
});

const UserOrder = mongoose.model("UserOrder", userorderSchema);

module.exports = UserOrder;