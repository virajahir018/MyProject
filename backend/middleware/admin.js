const jwt = require("jsonwebtoken");

function Admin(req, res, next,) {
    try {
        const token = req.headers.access?.split(" ")[1];

        if (!token) {
            return res.json({
                message: "Token required"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT);

        if (decoded.role !== "admin") {
            return res.json({
                message: "You are not admin"
            });
        }

        req.user = decoded;

        next();
    } catch (error) {

        res.json({
            message: error.message
        })
    }

}

module.exports = Admin