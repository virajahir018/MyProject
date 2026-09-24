const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const Product = require("../models/Product");
const Cart = require("../models/Cart");

const cartRouters = express.Router();

cartRouters.post("/add", authMiddleware, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findOne({ _id: productId });

        if (!product) {
            res.json({
                message: "Product  not found"
            })
        }

        let cart = await Cart.findOne({
            user: req.user.id
        })


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
        
    } catch (error) {
        res.json({
            message: error.message,
        })
    }
})

cartRouters.get("/", authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user.id,
        }).populate("items.product");

        if (!cart) {
            return res.json({
                user: req.user.id,
                items: [],
            });
        }

        res.json(cart);
    } catch (error) {
        res.json({
            message: error.message,
        });
    }
});

cartRouters.put("/update", authMiddleware, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const newQuantity = Number(quantity);

        if (!Number.isInteger(newQuantity) || newQuantity < 1) {
            return res.json({
                message: "Quantity must be a positive number"
            });
        }

        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {
            return res.json({
                message: "Cart not found"
            });
        }

        const item = cart.items.find(
            (item) =>
                item.product.toString() === productId
        );

        if (!item) {
            return res.json({
                message: "Product not found in cart"
            });
        }

        item.quantity = newQuantity;

        await cart.save();

        const updatedCart = await Cart.findById(cart._id)
            .populate("items.product");

        res.json(updatedCart);

    } catch (error) {
        res.json({
            message: "Error updating cart",
            error: error.message
        });
    }
});

cartRouters.delete("/remove", authMiddleware, async (req, res) => {
    try {
        const { productId } = req.body;

        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {
            return res.json({
                message: "Cart not found"
            });
        }

        cart.items = cart.items.filter(
            (item) =>
                item.product.toString() !== productId
        );

        await cart.save();

        const updatedCart = await Cart.findById(cart._id)
            .populate("items.product");

        res.json({
            message: "Product removed from cart",
            cart: updatedCart
        });

    } catch (error) {
        res.json({
            message: "Error removing product",
            error: error.message
        });
    }
});

cartRouters.delete("/clear", authMiddleware, async (req, res) => {
    try {
        const cart = await Cart.findOne({
            user: req.user.id
        });

        if (!cart) {
            return res.json({
                message: "Cart not found"
            });
        }

        cart.items = [];

        await cart.save();

        res.json({
            message: "Cart cleared successfully",
            cart
        });

    } catch (error) {
        res.json({
            message: "Error clearing cart",
            error: error.message
        });
    }
});

module.exports = cartRouters;