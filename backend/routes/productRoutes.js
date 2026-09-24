const express = require("express");
const Product = require("../models/Product");
const Admin = require("../middleware/admin");
const authMiddleware = require("../middleware/authMiddleware");

const productRoutes = express.Router();

productRoutes.get("/all", async (req, res) => {
    try {
        const product = await Product.find();

        res.json(product);
    } catch (error) {
        res.json({
            messege: error.messege,
        });
    }
})

productRoutes.post("/create", Admin, async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.json({
            message: "Product created successfully",
            product
        });
    } catch (error) {
        res.json({
            message: error.message,
        });
    }
})

productRoutes.put("/update/:id", Admin, async (req, res) => {
    try {

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!product) {
            return res.json({
                message: "Products not Found",
            })
        }

        res.json(product);
    } catch (error) {
        res.json({
            message: error.message,
        });
    }
})

productRoutes.delete("/delete/:id", Admin, async (req, res) => {
    try {

        const product = await Product.findByIdAndDelete(req.params.id,);

        if (!product) {
            return res.json({
                message: "Products not Found",
            })
        }

        res.json({
            message: "Product deleted successfully",
            product
        });
    } catch (error) {
        res.json({
            message: error.message,
        });
    }
})

module.exports = productRoutes;