import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import authRoutes from './routes/auth.js';

const app = express();

// Enable CORS for all origins (you can restrict this as needed)
app.use(cors());

// Use express.json() to parse JSON requests
app.use(express.json());
app.use(authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(config.PORT, () => {
  console.log(`Server is running - http://localhost:${config.PORT}`);
});
