const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userId).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated',
                errorCode: 'UNAUTHORIZED'
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'You do not have permission to perform this action',
                errorCode: 'FORBIDDEN'
            });
        }
        next();
    };
};

const checkOwnership = (Model) => {
    return async (req, res, next) => {
        try {
            // Admins can access everything
            if (req.user.role === 'admin') {
                return next();
            }

            // Users can only access their own resources
            const resource = await Model.findById(req.params.id);

            if (!resource) {
                return res.status(404).json({
                    success: false,
                    message: 'Resource not found',
                    errorCode: 'NOT_FOUND'
                });
            }

            if (resource.ownerId.toString() !== req.user._id.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'You can only access your own resources',
                    errorCode: 'FORBIDDEN'
                });
            }

            req.resource = resource;
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = { protect, restrictTo, checkOwnership };
