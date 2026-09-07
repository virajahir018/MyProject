const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const userRouters = express.Router();


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
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );


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

userRouters.get("/profile", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.json(user);
    } catch (error) {
        res.json({
            message: error.message,
        })
    }
})

userRouters.post("/logout", (req, res) => {
    res.json({
        message: "Logout successful"
    });
});

module.exports = userRouters;