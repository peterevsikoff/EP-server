import express from 'express';
import bodyParser from 'body-parser';
// import userRoutes from './routes/user.routes';
// import { supabaseErrorHandler } from './middlewares/supabaseErrorHandler';

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
// app.use('/api/users', userRoutes);

// Error handling
// app.use(supabaseErrorHandler);
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;