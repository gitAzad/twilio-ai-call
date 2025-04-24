import { config } from 'dotenv';
import app from './app';

config(); // Load environment variables from .env file

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
