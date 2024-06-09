import express from 'express'
import http from 'http'
import lobbyManager from './lobbyManager.js';
const app = express();
import { Server as SocketIOServer } from 'socket.io';
import { handleChatNamespace } from './chatNamespace.js';
import { handleClockNamespace } from './clockNamespace.js';
// Apply CORS middleware to all responses
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
// Define routes
app.get('/api/sayHi', (req, res) => {
    console.log('Received request on /api/sayHi');
    res.send('Hi from server!');
});

app.get('/api/clock', (requ, res) => {
    res.send("Hi from server");
})

app.get('/', (req, res) => {
    res.send('<h1>Welcome to My Server</h1>');
});

const server = http.createServer(app);
const io = new SocketIOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
})
// Chat Namespace
handleChatNamespace(io); 
//clock tower logic
//have a different activeUsernames for clock tower
// Clock Namespace
handleClockNamespace(io, lobbyManager);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



