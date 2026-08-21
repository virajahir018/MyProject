const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const userRouters = express.Router();

userRouters.get("/", async (req, res) => {

    try {
        const user = await User.find();

        res.json(user);
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

userRouters.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const exiUser = await User.findOne({ email });

        if (exiUser) {
            return res.json({
                message: "User Already Exists",
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name, email, password: hashPassword
        })

        res.json({
            message: "User Register Successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        })
    } catch (error) {
        res.json({
            message: error.message,
        })
    }
})

userRouters.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                message: "User Not Found",
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                message: "Invalid password",
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            "3e009e890d8fac816adfc9bef588c83f20ed3393b7c5c59a5865e1710f49ae20",
            {
                expiresIn: "1d",
            }
        );

        console.log(token)

        res.json({
            message: "Login successful",
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        })
    } catch (error) {
        res.json({
            message: error.message,
        })
    }


})


userRouters.post("/", async (req, res) => {

    try {
        const user = await User.create(req.body);
        res.json(user);
    } catch (error) {
        res.json({
            message: error.message
        })
    }
})

userRouters.put("/:id", async (req, res) => {

    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!user) {
            res.json({
                message: "USer not Found",
            })
        }
        res.status(201).json(user);
    } catch (error) {
        res.json({
            message: error.message,
        })
    }
})

module.exports = userRouters;