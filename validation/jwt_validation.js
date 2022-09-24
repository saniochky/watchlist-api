const config = require('config');
const jwt = require('jsonwebtoken');
const userSchema = require('../models/user');

const KEY = config.get('jwtSecret');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, KEY);
            const user = await userSchema.findById(decoded._id);

            if (user && user.encryptedPassword === decoded.encryptedPassword) {
                req.userId = user._id;
                next();
            } else {
                res.status(401).json({
                    'message': 'Invalid token',
                });
            }
        } catch (e) {
            res.status(401).json({
                'message': 'Invalid token',
            });
        }
    } else {
        res.status(401).json({
            'message': 'Missing token',
        });
    }
};
