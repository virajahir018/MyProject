const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.access?.split(" ")[1];

        if (!token) {
            return res.json({
                message: "Token required",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT);

        req.user = decoded;

        next();
    } catch (error) {
        return res.json({
            message: "Invalid or expired token",
        });
    }
};

module.exports = authMiddleware;