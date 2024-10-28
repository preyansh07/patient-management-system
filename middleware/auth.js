const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = (roles) => {
    return async (req, res, next) => {
        try {
            const token = req.header('Authorization').replace('Bearer ', '');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded)
            const user = await User.findById(decoded.id);
            console.log(user)
            if (!user || !roles.includes(user.role)) {
                throw new Error('Not authorized');
            }

            req.user = user;
            next();
        } catch (err) {
            res.status(401).json({ message: 'Not authorized' });
        }
    };
};

module.exports = authMiddleware;
