import { Router } from "express";
import { UserService } from "./userService";
import { CreateUserDto } from './userDto';
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_secret_key";

const userService = new UserService();
const userRouter = Router();

userRouter.put("/user", async (req, res) => {
    const parsedData = CreateUserDto.parse(req.body);
    await userService.crupdateUser(parsedData);
    res.json({ message: "User created/updated" });
});

userRouter.get("/user/:id", async (req, res) => {

router.post("/register", async (req, res) => {
    try {
        // Création ou mise à jour de l'utilisateur
        const user = await userService.crupdateUser(req.body);

        // Génération du token
        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

        // Retourner les données avec le token
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


// ✅ Route de connexion
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const { token, user } = await userService.loginUser(email, password);
        res.json({ token, user });
    } catch (error) {
        if (error instanceof Error) {
            res.status(401).json({ message: error.message });
        } else {
            res.status(401).json({ message: "An unknown error occurred" });
        }
    }
});

router.get("/user/:id", async (req, res) => {
    const user = await userService.getUserById(Number(req.params.id));
    res.json(user);
});

userRouter.get("/users", async (req, res) => {
    const users = await userService.getAllUsers();
    res.json(users);
});

userRouter.get("/user/email/:email", async (req, res) => {
    const user = await userService.getUserByEmail(req.params.email);
    res.json(user);
});

userRouter.get("/user/name/:name", async (req, res) => {
    const user = await userService.getUserByName(req.params.name);
    res.json(user);
});

userRouter.delete("/user/:id", async (req, res) => {
    await userService.deleteUser(Number(req.params.id));
    res.json({ message: "User deleted" });
});

export default userRouter;
