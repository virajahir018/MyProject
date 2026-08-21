const express = require("express");
const UserOrder = require("../models/UserOrder");

const userorderRoutes = express.Router();

userorderRoutes.get("/", async (req, res) => {
    try {
        const order = await UserOrder.find()
            .populate("user")
            .populate("product");

        console.log(order);

        res.json(order);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

userorderRoutes.post("/", async (req, res) => {
    try {
        const order = await UserOrder.create({
            user: req.body.user,
            product: req.body.product
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = userorderRoutes;