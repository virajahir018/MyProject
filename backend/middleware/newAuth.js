function newAuth(req, res, next) {

    console.log(req.session.userId)

    if (!req.session.userId) {
        return res.status(401).json({
            message: "Please login"
        });
    }

    req.user = {
        id: req.session.userId
    };

    next();
}

module.exports = newAuth