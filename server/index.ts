import { createServer } from "http";
import express from 'express';
import next, { NextApiHandler } from 'next';
import dotenv from 'dotenv';
import { Server } from 'socket.io'
import { ClientToServerEvents, ServerToClientEvents } from "@/common/types/global";
// import "../common/types/global.d.ts";

dotenv.config();
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
    const app = express();
    const server = createServer(app);

    const io = new Server<ClientToServerEvents, ServerToClientEvents>(server);

    app.get("/health", async (_, res) => {
        res.send("Healthy");
    });

    io.on("connection", (socket) => {
        console.log("Connection");

        socket.on("draw", (moves: any, options: any) => {
            console.log("drawing");
            socket.broadcast.emit("socket_draw", moves, options);
        });

        socket.on("disconnect", () => {
            console.log("Client Disconnected");
        })
    })

    app.all("*", (req: any, res: any) => nextHandler(req, res));

    server.listen(port, () => {
        console.log(`Server is running on ${port} successfully`);
    })
})