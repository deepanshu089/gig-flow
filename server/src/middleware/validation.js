const Joi = require('joi');

const validate = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body, { abortEarly: false });

        if (error) {
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors,
                errorCode: 'VALIDATION_ERROR'
            });
        }

        next();
    };
};

// Validation schemas
const registerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name must not exceed 50 characters',
        'any.required': 'Name is required'
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    }),
    role: Joi.string().valid('user', 'admin').optional()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required'
    })
});

const gigSchema = Joi.object({
    title: Joi.string().min(5).max(100).required().messages({
        'string.min': 'Title must be at least 5 characters long',
        'string.max': 'Title must not exceed 100 characters',
        'any.required': 'Title is required'
    }),
    description: Joi.string().min(20).max(1000).required().messages({
        'string.min': 'Description must be at least 20 characters long',
        'string.max': 'Description must not exceed 1000 characters',
        'any.required': 'Description is required'
    }),
    budget: Joi.number().positive().required().messages({
        'number.positive': 'Budget must be a positive number',
        'any.required': 'Budget is required'
    }),
    status: Joi.string().valid('open', 'assigned').optional()
});

const gigUpdateSchema = Joi.object({
    title: Joi.string().min(5).max(100).optional(),
    description: Joi.string().min(20).max(1000).optional(),
    budget: Joi.number().positive().optional(),
    status: Joi.string().valid('open', 'assigned').optional()
}).min(1).messages({
    'object.min': 'At least one field must be provided for update'
});

module.exports = {
    validate,
    registerSchema,
    loginSchema,
    gigSchema,
    gigUpdateSchema
};
