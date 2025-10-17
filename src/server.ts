import express from 'express'
import dotenv from 'dotenv';
import { setupSwagger } from './infra/config/swagger';
import cors from 'cors';
import AuthRouter from './infra/web/routes/AuthRoutes';
import ListingRouter from './infra/web/routes/ListingRoutes';
import path from 'path';

dotenv.config();

const app = express();


app.use(express.json());

app.use(cors({
  origin: ["*"], 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

const listingsStoragePath = path.resolve(__dirname, '..', 'src', 'infra', 'storage', 'listings');

app.use('/media/', express.static(listingsStoragePath));
app.use('/auth/', AuthRouter);
app.use('/listing/', ListingRouter)




setupSwagger(app);

export default app;

app.listen(process.env.PORT, () => console.log(`Server running on ${process.env.URL}:${process.env.PORT}\nAPI docs available at ${process.env.URL}:${process.env.PORT}/docs`));