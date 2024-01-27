const express = require('express');
const http = require('http');

const app = express();

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

app.get('/', (req, res) => {
  res.send('<h1>Welcome to My Server</h1>');
});

const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {
      origin: "*", // Allow all origins
      methods: ["GET", "POST"] // Allow only GET and POST requests
    }
  });

  let userCount=0; //track the number of connected users. 
  

io.on('connection', (socket) => {
    userCount++; //increment user userCount
    io.emit('userCount', { count: userCount }); //emit the count to all
    console.log('A user connected');
    
    socket.on('sendMessage', (msg) => {
        console.log('Message from client:', msg);
        // Echo the message back to the client
        socket.broadcast.emit('message', 'Message received: ' + msg);
    });
    
    socket.on('disconnect', () => {
        userCount--; //decrement the user count
        console.log('User disconnected');
        io.emit('userCount', { count: userCount })
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));