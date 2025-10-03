import express from 'express'
import dotenv from 'dotenv';
import { setupSwagger } from './infra/config/swagger';
import cors from 'cors';
import AuthRouter from './infra/web/routes/AuthRoutes';

dotenv.config();

const app = express();


app.use(express.json());

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3000", "https://valugar.vercel.app", "https://admin.valugar.vercel.app"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use('/auth/', AuthRouter);




setupSwagger(app);

export default app;

app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.URL}:${process.env.PORT}\nAPI docs available at ${process.env.URL}:${process.env.PORT}/docs`));