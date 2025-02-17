import express from 'express';
const app = express();
const port = 3000;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

app.get("/", (request, response) => {
   response.json({
       data: 'Hello world!'
   });
})

app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany();
    res.json(users);
});

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});

  