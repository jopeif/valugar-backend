import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import { Express } from 'express';
import { isBlock } from 'typescript';

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
            }
        }
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [path.resolve(__dirname, '../web/routes/*.ts')],
};

const swaggerSpec = swaggerJSDoc(options);


export const setupSwagger = (app: Express) => {
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
