import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { Express } from 'express';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Valugar',
            version: '1.0.0',
            description: 'Documentação da API do Valugar',
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Servidor local' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                RegisterUserDTO: {
                    type: 'object',
                    properties: {
                        email: { type: 'string' },
                        name: { type: 'string' },
                        password: { type: 'string' },
                        phone: { type: 'string' },
                    },
                    required: ['email', 'name', 'password', 'phone'],
                },
                RegisterAdminDTO: {
                    type: 'object',
                    properties: {
                        email: { type: 'string' },
                        name: { type: 'string' },
                        password: { type: 'string' },
                        phone: { type: 'string' },
                        creationCode: { type: 'string' },
                    },
                    required: ['email', 'name', 'password', 'phone', 'creationCode'],
                },
                LoginDTO: {
                    type: 'object',
                    properties: {
                        email: { type: 'string' },
                        password: { type: 'string' },
                    },
                    required: ['email', 'password'],
                },
                RefreshTokenDTO: {
                    type: 'object',
                    properties: {
                        refreshToken: { type: 'string' }
                    },
                    required: ['refreshToken'],
                },
                UserResponse: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' },
                        phone: { type: 'string' },
                        role: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        isBlocked: { type: 'boolean' }
                    }
                },
                RegisterListingDTO: {
                    type: 'object',
                    properties: {
                        title: { type: 'string' },
                        description: { type: 'string' },
                        type: { type: 'string', enum: ['SALE', 'RENT'] },
                        category: { type: 'string', enum: ['RESIDENCIAL', 'COMMERCIAL', 'MIXED_USE'] },
                        basePrice: { type: 'number' },
                        iptu: { type: 'number' },
                        userId: { type: 'string' },
                        address: {
                            type: 'object',
                            properties: {
                                zipCode: { type: 'string' },
                                state: { type: 'string' },
                                city: { type: 'string' },
                                neighborhood: { type: 'string' },
                                street: { type: 'string' },
                                reference: { type: 'string', nullable: true }
                            },
                            required: ['zipCode', 'state', 'city', 'neighborhood', 'street']
                        },
                        details: {
                            type: 'object',
                            properties: {
                                area: { type: 'string' },
                                bedrooms: { type: 'number' },
                                bathrooms: { type: 'number' }
                            },
                            required: ['area', 'bedrooms', 'bathrooms']
                        }
                    },
                    required: ['title', 'type', 'category', 'basePrice', 'userId', 'address', 'details']
                },
                FindListingByIdDTO: {
                    type: 'object',
                    properties: {
                        id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        type: { type: 'string', enum: ['SALE', 'RENT'] },
                        category: { type: 'string', enum: ['RESIDENCIAL', 'COMMERCIAL', 'MIXED_USE'] },
                        basePrice: { type: 'number' },
                        iptu: { type: 'number' },
                        userId: { type: 'string' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                        address: {
                            type: 'object',
                            properties: {
                                zipCode: { type: 'string' },
                                state: { type: 'string' },
                                city: { type: 'string' },
                                neighborhood: { type: 'string' },
                                street: { type: 'string' },
                                reference: { type: 'string', nullable: true }
                            },
                            required: ['zipCode', 'state', 'city', 'neighborhood', 'street']
                        },
                        details: {
                            type: 'object',
                            properties: {
                                area: { type: 'string' },
                                bedrooms: { type: 'number' },
                                bathrooms: { type: 'number' }
                            },
                            required: ['area', 'bedrooms', 'bathrooms']
                        }
                    }
                }
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [path.resolve(__dirname, '../web/routes/*.ts')],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
