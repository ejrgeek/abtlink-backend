const jwt = require('jsonwebtoken');
const env = require('../config/env');


function createToken(user) {
    return jwt.sign (
        {
            sub: user.id,
            role: user.role,
        },
        env.jwtSecret,
        {
            expiresIn: env.jwtExpiresIn,
        }
    );
}

function verifyToken(token) {
    return jwt.verify(token, env.jwtSecret);
}

module.exports = {
    createToken, verifyToken,
};