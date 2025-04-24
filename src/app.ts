import express from 'express';
import { urlencoded } from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import twilioRouter from './routes/twilio';
import setupRouter from './routes/setup';
import { swaggerSpec } from './config/swaggerConfig';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(urlencoded({ extended: false }));

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/twilio', twilioRouter);
app.use('/setup', setupRouter);

app.get('/', (req, res) => {
  res.send('Twilio AI Call System');
});

export default app;
