import express from 'express'
import dotenv from 'dotenv';

import AuthRouter from './infra/web/routes/AuthRoutes';

dotenv.config();

const app = express();
app.use(express.json());

app.use(express.json());

app.use('/auth/', AuthRouter);

export default app;

app.listen(process.env.PORT, () => console.log(`Server running on port ${process.env.PORT}`));