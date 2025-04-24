import express from 'express';
import { urlencoded } from 'body-parser';
import twilioRouter from './routes/twilio';
import setupRouter from './routes/setup';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(urlencoded({ extended: false }));

// Routes
app.use('/twilio', twilioRouter);
app.use('/setup', setupRouter);

app.get('/', (req, res) => {
  res.send('Twilio AI Call System');
});

export default app;
