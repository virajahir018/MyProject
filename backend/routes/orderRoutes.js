const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const Cart = require("../models/Cart");

const orderRoutes = express.Router();

orderRoutes.post("/create", authMiddleware, async (req, res) => {

    let cart = await Cart.findOne({
        user: req.user.id
    }).populate("items.product")

    if (!cart || cart.items.lenght === 0) {
        return res.json({
            message: "Cart is empty"
        });
    }

    let totalPrice = 0;
    const products = [];

    for (const item of cart.items) {
        const product = item.product;

        if (product.stock < item.quantity) {
            return res.json({
                message: `Not enough stock for ${product.title}`
            });
        }

        totalPrice += product.price * item.quantity

        products.push({
            product: product._id,
            price: product.price,
            quantity: item.quantity
        })

    }

    const order = await Order.create({
        user: req.user.id,
        products: products,
        totalPrice
    });

    res.json(order);
})

module.exports = orderRoutes;