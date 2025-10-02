import express from 'express'
import dotenv from 'dotenv';
import { setupSwagger } from './infra/config/swagger';

import AuthRouter from './infra/web/routes/AuthRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.use(express.json());

app.use('/auth/', AuthRouter);


setupSwagger(app);

export default app;

app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:3000/${process.env.PORT}\nAPI docs available at http://localhost:3000/docs`));