import { Router } from "express";
import { RoomService } from "./roomService";
import { CreateRoomDto } from "./roomDto";

const roomService = new RoomService();
const roomRouter = Router();

roomRouter.put("/room", async (req, res) => {
    const parsedData = CreateRoomDto.parse(req.body);
    await roomService.crrupdateRoom(parsedData);
    res.json({ message: "Room created/updated" });
});

roomRouter.get("/room/:id", async (req, res) => {
    const room = await roomService.getRoomById(Number(req.params.id));
    res.json(room);
});

roomRouter.get("/rooms", async (req, res) => {
    const rooms = await roomService.getAllRooms();
    res.json(rooms);
});

roomRouter.get("/room/:number", async (req, res) => {
    const room = await roomService.getRoomByNumber(Number(req.params.number));
    res.json(room);
});

roomRouter.delete("/room/:id", async (req, res) => {
    await roomService.deleteRoom(Number(req.params.id));
    res.json({ message: "Room deleted" });
});

export default roomRouter;
