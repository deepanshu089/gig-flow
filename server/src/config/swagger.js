const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'GigFlow API',
            version: '1.0.0',
            description: 'A mini-freelance marketplace platform API with role-based access control',
            contact: {
                name: 'GigFlow Team',
            },
        },
        servers: [
            {
                url: 'http://localhost:5000',
                description: 'Development server',
            },
            {
                url: 'https://api.gigflow.com',
                description: 'Production server',
            },
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'jwt',
                    description: 'JWT token stored in HTTP-only cookie',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'User ID',
                        },
                        name: {
                            type: 'string',
                            description: 'User name',
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            description: 'User email',
                        },
                        role: {
                            type: 'string',
                            enum: ['user', 'admin'],
                            description: 'User role',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Gig: {
                    type: 'object',
                    properties: {
                        _id: {
                            type: 'string',
                            description: 'Gig ID',
                        },
                        title: {
                            type: 'string',
                            description: 'Gig title',
                        },
                        description: {
                            type: 'string',
                            description: 'Gig description',
                        },
                        budget: {
                            type: 'number',
                            description: 'Gig budget',
                        },
                        ownerId: {
                            type: 'string',
                            description: 'Owner user ID',
                        },
                        status: {
                            type: 'string',
                            enum: ['open', 'assigned'],
                            description: 'Gig status',
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                        },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        success: {
                            type: 'boolean',
                            example: false,
                        },
                        message: {
                            type: 'string',
                            description: 'Error message',
                        },
                        errorCode: {
                            type: 'string',
                            description: 'Error code',
                        },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'string',
                            },
                            description: 'Validation errors (if applicable)',
                        },
                    },
                },
            },
        },
        tags: [
            {
                name: 'Authentication',
                description: 'User authentication endpoints',
            },
            {
                name: 'Gigs',
                description: 'Gig management endpoints',
            },
        ],
    },
    apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
