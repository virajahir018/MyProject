const express = require("express");
const Product = require("../models/Product");

const productRoutes = express.Router();

productRoutes.get("/", async (req, res) => {
    try {
        const product = await Product.find();

        res.json(product);
    } catch (error) {
        res.json({
            messege: error.messege,
        });
    }
})

productRoutes.post("/", async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.json(product);
    } catch (error) {
        res.json({
            message: error.message,
        });
    }
})

productRoutes.put("/:id", async (req, res) => {
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

productRoutes.delete("/:id", async (req, res) => {
    try {

        const product = await Product.findByIdAndDelete(req.params.id,);

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

module.exports = productRoutes;