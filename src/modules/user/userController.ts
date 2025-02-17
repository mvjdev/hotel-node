import { Router } from "express";
import { UserService } from "./userService";
import { CreateUserDto } from './userDto';

const userService = new UserService();
const router = Router();

router.put("/user", async (req, res) => {
    const parsedData = CreateUserDto.parse(req.body);
    await userService.crupdateUser(parsedData);
    res.json({ message: "User created/updated" });
});

router.get("/user/:id", async (req, res) => {
    const user = await userService.getUserById(Number(req.params.id));
    res.json(user);
});

router.get("/users", async (req, res) => {
    const users = await userService.getAllUsers();
    res.json(users);
});

router.get("/user/email/:email", async (req, res) => {
    const user = await userService.getUserByEmail(req.params.email);
    res.json(user);
});

router.get("/user/name/:name", async (req, res) => {
    const user = await userService.getUserByName(req.params.name);
    res.json(user);
});

router.delete("/user/:id", async (req, res) => {
    await userService.deleteUser(Number(req.params.id));
    res.json({ message: "User deleted" });
});

export default router;
