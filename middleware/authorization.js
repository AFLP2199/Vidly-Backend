const jwt = require("jsonwebtoken");
const config = require("config");

//Middleware function to check authorization
module.exports = function authorization(req, res, next) {
    if (!config.get("requiresAuth")) return next();

    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied. No token provided.");

    try {
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).send("Invalid token.");
    }
};
