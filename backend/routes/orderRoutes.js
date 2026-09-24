const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Admin = require("../middleware/admin");

const orderRoutes = express.Router();

orderRoutes.post("/create", authMiddleware, async (req, res) => {
    try {

        let cart = await Cart.findOne({
            user: req.user.id
        }).populate("items.product")

        if (!cart || cart.items.length === 0) {
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
            products,
            totalPrice
        });

        for (const item of cart.items) {
            item.product.stock -= item.quantity;
            await item.product.save();
        }

        await Cart.findOneAndDelete({ user: req.user.id })

        res.json({
            message: "Order created successfully",
            order
        });

    } catch (error) {

        res.json({
            message: error.message
        })
    }
})

orderRoutes.get("/all", Admin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "-password")
            .populate("products.product")
            .sort({ createdAt: -1 });

            console.log(orders.user)

        res.status(200).json({
            message: "All orders fetched successfully",
            orders
        });

    } catch (error) {
        res.status(500).json({
            message: "Error fetching all orders",
            error: error.message
        });
    }
});

orderRoutes.get("/my-orders", authMiddleware, async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user.id
        }).populate("products.product")
            .sort({ createdAt: -1 });

        res.json({
            message: "Orders fetched successfully",
            orders
        });

    } catch (error) {
        res.json({
            message: "Error fetching orders",
            error: error.message
        });
    }
});

orderRoutes.get("/:id", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate("products.product")

        if (!order) {
            return res.json({
                message: "Order not found"
            });
        }

        res.json({
            message: "Orders fetched successfully",
            order
        });

    } catch (error) {
        res.json({
            message: "Error fetching orders",
            error: error.message
        });
    }
});

orderRoutes.put("/:id/cancel", authMiddleware, async (req, res) => {
    try {
        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user.id
        }).populate("products.product")

        if (!order) {
            return res.json({
                message: "Order not found"
            });
        }

        if (order.status !== "pending") {
            return res.status(400).json({
                message: "Only pending orders can be cancelled"
            });
        }

        for (const item of order.products) {
            item.product.stock += item.quantity;

            await item.product.save();
        }

        order.status = "cancelled";

        await order.save();

        res.json({
            message: "Order cancelled and stock restored successfully",
            order
        });

    } catch (error) {
        res.json({
            message: "Error cancelling  orders",
            error: error.message
        });
    }
});

module.exports = orderRoutes;