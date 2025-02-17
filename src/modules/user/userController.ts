import { Router } from "express";
import { UserService } from "./userService";
import { CreateUserDto } from './userDto';

const userService = new UserService();
const userRouter = Router();

userRouter.put("/user", async (req, res) => {
    const parsedData = CreateUserDto.parse(req.body);
    await userService.crupdateUser(parsedData);
    res.json({ message: "User created/updated" });
});

userRouter.get("/user/:id", async (req, res) => {
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
