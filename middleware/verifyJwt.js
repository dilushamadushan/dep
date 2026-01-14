const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401);

        const token = authHeader.split(" ")[1];

        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) throw new Error("ACCESS_TOKEN_SECRET not set");

        jwt.verify(token, secret, (err, decoded) => {
            if (err) return res.sendStatus(403);
            req.user = decoded.username;
            req.role = decoded.role;
            next();
        });
    } catch (err) {
        console.error("JWT verification failed:", err.message);
        res.sendStatus(500);
    }
};

module.exports = verifyJwt;
