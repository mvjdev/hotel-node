import express from 'express';
import router from './modules/user/userController';
import cors from "cors";
const app = express();
app.use(express.json());

app.use(cors()); // Permet les requêtes CORS

app.use('/', router);

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));

export default app;
