import { Router } from "express";
import { UserService } from "./userService";
import { AuthService } from "../auth/authService";
import jwt from "jsonwebtoken";
import { Env } from "../../config/env";
import { authenticateJWT, authorizeRole } from "../../middlewares/authMiddleware";

const userService = new UserService();
const authService = new AuthService();
const userRouter = Router();

userRouter.post("/register", async (req, res) => {
    try {
        const user = await authService.registerUser(req.body);
        
        const token = jwt.sign({ userId: user.id, email: user.email }, Env.JWT_SECRET, { expiresIn: "1h" });
        
        res.status(201).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: "An unknown error occurred" });
        }
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await authService.loginUser(email, password);
        res.json({ token, user });
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        } else {
            res.status(401).json({ message: "An unknown error occurred" });
        }
    }
});

userRouter.get("/user/:id", authenticateJWT, authorizeRole("USER"), async (req, res) => {
    const user = await userService.getUserById(Number(req.params.id));
    res.json(user);
});

userRouter.get("/users", authenticateJWT, authorizeRole("ADMIN"), async (req, res) => {
    const users = await userService.getAllUsers();
    res.json(users);
});

userRouter.get("/user/email/:email", authenticateJWT, authorizeRole("ADMIN"), async (req, res) => {
    const user = await userService.getUserByEmail(req.params.email);
    res.json(user);
});

userRouter.get("/user/name/:name", authenticateJWT, authorizeRole("ADMIN"), async (req, res) => {
    const user = await userService.getUserByName(req.params.name);
    res.json(user);
});

userRouter.delete("/user/:id", authenticateJWT, authorizeRole("ADMIN"), async (req, res) => {
    await userService.deleteUser(Number(req.params.id));
    res.json({ message: "User deleted" });
});

export default userRouter;
