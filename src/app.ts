import express from 'express';
import userRouter from './modules/user/userController';
import roomRouter from './modules/room/roomController';
import bookingRouter from './modules/booking/bookingController';
import passport from "passport";
import session from "express-session";
import cors from 'cors';
import authRouter from './modules/auth/authController';
import cookieParser from 'cookie-parser';
import "./config/passport";

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

const options: cors.CorsOptions = {
    origin: allowedOrigins,
    credentials: true,
};


const app = express();
app.use(express.json());
app.use(cors(options));

app.use(cookieParser());
app.use('/', userRouter);
app.use('/', roomRouter);
app.use('/', bookingRouter);

app.use(
    session({
        secret: process.env.JWT_SECRET as string,
        resave: false,
        saveUninitialized: false,
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);

app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));

export default app;
