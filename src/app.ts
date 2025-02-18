import express from 'express';

import userRouter from './modules/user/userController';
import roomRouter from './modules/room/roomController';
import bookingRouter from './modules/booking/bookingController';

const app = express();
app.use(express.json());

app.use('/', userRouter);
app.use('/', roomRouter);
app.use('/', bookingRouter);

import router from './modules/user/userController';
import cors from "cors";
const app = express();
app.use(express.json());

app.use(cors()); // Permet les requêtes CORS

app.use('/', router);


app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));

export default app;
