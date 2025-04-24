import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Twilio AI Call API',
      version: '1.0.0',
      description: 'API documentation for the Twilio AI Call System',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: '{server}',
        variables: {
          server: {
            default: process.env.BASE_URL || 'http://localhost:3000',
            description: 'API server',
          },
        },
      },
    ],
    components: {
      schemas: {
        UserResponse: {
          type: 'object',
          properties: {
            userId: {
              type: 'string',
              description: 'Unique identifier for the user',
            },
            phoneNumber: {
              type: 'string',
              description: 'Phone number of the user',
            },
            questionId: {
              type: 'string',
              description: 'ID/index of the question',
            },
            response: {
              type: 'string',
              description: "The user's response to the question",
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'When the response was recorded',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
};

export const swaggerSpec = swaggerJsdoc(options);
