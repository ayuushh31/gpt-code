import Express from "express";
import Cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { get_chat_data, update_chat_data } from "./user.js"; // Make sure to add .js extension for module imports

const port = 5000;
const server = Express();

server.use(Cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
server.use(bodyParser.json({ limit: '10mb' }));
server.use(cookieParser());

server.listen(port, function () {
    console.log("Server is running");
});

server.get('/update_chat_data', update_chat_data);
server.get('/get_chat_data', get_chat_data)