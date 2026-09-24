const express = require("express");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const generateToken = require("../token/generateToken");
const Admin = require("../middleware/admin");
const nodemailer = require("nodemailer");
const newAuth = require("../middleware/newAuth");

const userRouters = express.Router();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify((error, success) => {
    if (error) {
        console.log("EMAIL ERROR:", error);
    } else {
        console.log("EMAIL SERVER READY");
    }
});

userRouters.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email })

        if (!user) {
            return res.json({
                message: "If this email is registered, a password reset link has been sent"
            });
        }

        const otp = crypto.randomInt(100000, 1000000).toString();

        user.resetOtp = otp;
        user.resetOtpExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your password reset OTP is ${otp}. It is valid for 10 minutes.`
        });

        res.json({
            message: "OTP sent successfully",
        })

    } catch (error) {
        res.json({
            message: error.message
        });
    }
});

userRouters.post("/reset-password", async (req, res) => {
    try {
        const { password, otp } = req.body;

        const user = await User.findOne({
            resetOtp: otp,
            resetOtpExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired OTP"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetOtp = undefined;
        user.resetOtpExpire = undefined;

        await user.save();

        res.json({
            message: "Password reset successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

userRouters.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const exiUser = await User.findOne({ email });

        if (exiUser) {
            return res.json({
                message: "User Already Exists",
            })
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role
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

        req.session.userId = user._id;

        res.json({
            message: "Login successful",
            user: req.session.userId
        })
    } catch (error) {
        res.json({
            message: error.message,
        })
    }


})

userRouters.get("/profile", newAuth, async (req, res) => {
    res.json({
        message: "Profile",
        user: req.user
    })
})

userRouters.post("/logout", (req, res) => {
    res.json({
        message: "Logout successful"
    });
});

userRouters.post("/update", newAuth, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (name) {
            user.name = name;
        }

        if (email) {
            user.email = email;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        res.json({
            message: "User updated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});



module.exports = userRouters;