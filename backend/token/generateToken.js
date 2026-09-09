const jwt = require("jsonwebtoken");

function generateToken(obj, type) {
    let token;
    if (type == "access") {

        token = jwt.sign({ ...obj }, process.env.JWT, { expiresIn: "1D" })
    }

    return token
}

module.exports = generateToken;