import express from 'express';
import userRouter from './modules/user/userController';
import roomRouter from './modules/room/roomController';

const app = express();
app.use(express.json());

app.use('/', userRouter);
app.use('/', roomRouter);

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));

export default app;
