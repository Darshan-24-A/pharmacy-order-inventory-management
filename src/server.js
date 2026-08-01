import http from "http";
import app from "./app.js";

import { initializeSocket } from "./sockets/socket.js";

import "./config/db.js";
import "./config/redis.js";

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

initializeSocket(server);

server.listen(PORT, () => {

    console.log(`🚀 Server running on http://localhost:${PORT}`);

});