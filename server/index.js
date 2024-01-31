const express = require('express');
const http = require('http');
const lobbyManager = require('./lobbyManager');
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

app.get('/api/clock', (requ, res) => {
  res.send("Hi from server");
})

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
const activeUsers = {};// add an object to keep track of the users. 
  

io.on('connection', (socket) => {
  //clock tower logic?
  


    //doing my users names logic
    let userName= ''; //sore the current users name
    socket.emit('userCount', { count: Object.keys(activeUsers).length }) ; //send current user count immiedietly

    socket.on('registerUser', (name) => {
      if(userName) {
        //user ahs already registered a name; ignore re-register
        return;
      }

      if (activeUsers[name]) {
        //name is already taken, send an error message back
        socket.emit('registrationFailed', 'Name is already taken in this instace');
      }
      else {
        //register the user
        userName = name;
        activeUsers[name] = socket.id;
        socket.emit('registrationSuccess', 'Registered temporarily as ${name}');
        userCount = Object.keys(activeUsers).length;
        io.emit('userCount', { count: userCount});
      }
    });


    // userCount++; //increment user userCount
    // io.emit('userCount', { count: userCount }); //emit the count to all
    console.log('A user connected');
    
    socket.on('sendMessage', (messageObject) => {
      console.log('Message from client:', messageObject);
      // Include the sender's socket ID in the message object
      const fullMessage = {
        ...messageObject,
        id: socket.id, // Add the sender's ID to the message object
        type: 'received' // Assume all messages are received unless it's from the current user
      };
      // Emit the message to all clients except the sender
      socket.broadcast.emit('message', fullMessage);
      // Emit a 'sent' message back to the sender
      socket.emit('message', { ...fullMessage, type: 'sent' });
  });
    
    socket.on('disconnect', () => {
        if(userName){
          delete activeUsers[userName]; //remove the user from activeUsers
          userCount = Object.keys(activeUsers).length;
          io.emit('userCount', { count: userCount });
        }
        // userCount--; //decrement the user count
        console.log('User disconnected');
        // io.emit('userCount', { count: userCount })
    });
});
//clock tower logic

io.on('connection', (socket) => {
  console.log("User Connected to Clock");

  socket.on('createLobby', (lobbyName) => {
    const lobbyId = lobbyManager.createLobby(socket, lobbyName);
    if (lobbyId) {
      console.log("creating lobby of " ,lobbyName);
      console.log("lobby id is ", lobbyId);
      // After successfully creating a new lobby, fetch the updated list of lobbies
      const updatedLobbies = lobbyManager.getLobbies();
      // Broadcast the updated list of lobbies to all connected clients
      io.emit('lobbiesList', updatedLobbies);
    } else {
      // Handle error, e.g., lobby name already taken
      socket.emit('lobbyCreationFailed', 'Lobby name already taken.');
    }
  });

  socket.on('getLobbies', () => { // Remove the 'socket' parameter here
    const currentLobbies = lobbyManager.getLobbies();
    socket.emit('lobbiesList', currentLobbies);
    console.log("current lobbie are ", currentLobbies);
  });

  // Handle other events like joinLobby, leaveLobby...
});



const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

