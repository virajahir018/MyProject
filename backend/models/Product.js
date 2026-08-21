const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, },

        brand: { type: String, required: true, },

        price: { type: Number, required: true, },

        originalPrice: { type: Number, required: true, },

        discount: { type: String, required: true, },

        rating: { type: Number, default: 0, },

        image: { type: String, required: true, },
    },
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product;