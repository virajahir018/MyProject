const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

const cartRouters = express.Router();

cartRouters.post("/add", authMiddleware, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findOne({_id:productId});

        if (!product) {
            res.json({
                message: "Product  not found"
            })
        }

        let cart = await Cart.findOne({
            user: req.user.id
        })

        if (!cart) {
            cart = await Cart.create({
                user: req.user.id,
                items: [
                    {
                        product: productId,
                        quantity: quantity || 1,
                    },
                ],
            });
            return res.json(cart)
        }

        const existingItem = cart.items.find(
            (item) => item.product.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity || 1;
        } else {
            cart.items.push({
                product: productId,
                quantity: quantity || 1,
            });
        }

        await cart.save();

        res.status(200).json(cart);

    } catch (error) {
        res.json({
            message: error.message,
        })
    }
})

module.exports = cartRouters;