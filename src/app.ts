import express from 'express';
import bodyParser from 'body-parser';
import cors from "cors";
import userRoutes from './routes/user.routes';
import dotenv from 'dotenv';
// import { supabaseErrorHandler } from './middlewares/supabaseErrorHandler';

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.json());
// console.log(process.env.CLIENT_CORS);
app.use(cors({origin: [process.env.CLIENT_CORS ?? ""]}));

// Routes
app.use('/users', userRoutes);

// Error handling
// app.use(supabaseErrorHandler);
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;