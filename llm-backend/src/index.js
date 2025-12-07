import express from 'express';
import { ENV } from './config/env.js';
import analysisRoutes from './routes/analysisRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(express.json());

// Routes
app.use('/api', analysisRoutes);

// Error handler (last)
app.use(errorHandler);

app.listen(ENV.PORT, () => {
  console.log(`Server running on port ${ENV.PORT}`);
});
