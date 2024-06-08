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


// Chat Namespace
const chat = io.of('/chat');

let userCountChat = 0; //track the number of connected users.
const activeUsersChat = {};// add an object to keep track of the users.

chat.on('connection', (socket) => {
    //RealTimeChat logic
    //////////
    ///////////
    let userNameChat;
    socket.emit('userCountChat', { count: Object.keys(activeUsersChat).length }); //send current user count immiedietly

    socket.on('registerUser', (userNameChat) => {
        if (activeUsersChat[userNameChat]) {
            // Name is already taken, send an error message back
            socket.emit('registrationFailed', 'Name is already taken in this instance');
        } else {
            // Register the user
            activeUsersChat[userNameChat] = socket.id; // Associate userName with socket ID
            socket.userNameChat = userNameChat;
            socket.emit('registrationSuccess', `Registered temporarily as ${userNameChat}`);
            userCountChat = Object.keys(activeUsersChat).length;
            chat.emit('userCountChat', { count: userCountChat });
        }
    });


    // userCount++; //increment user userCount
    // io.emit('userCount', { count: userCount }); //emit the count to all
    // console.log('A user connected');

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
        if (socket.userNameChat && activeUsersChat[socket.userNameChat]) {
            delete activeUsersChat[socket.userNameChat]; //remove the user from activeUsers
            userCountChat = Object.keys(activeUsersChat).length;
            chat.emit('userCountChat', { count: userCountChat });
        }
        // userCount--; //decrement the user count
        console.log('User disconnected');
        console.log('number of users is ', userCountChat)
        // io.emit('userCount', { count: userCount })
    });
});
//
//
//
//clock tower logic
//////////
///////////
//have a different activeUsernames for clock tower
//
//
//
//
// Clock Namespace
const clock = io.of('/clock');
clock.on('connection', (socket) => {
    console.log("User Connected to Clock");

    //logic for getting the current lobbyname connected on
    let currentLobby = lobbyManager.retrieveLobbyNameFromSocket(socket); //how to implement this?
    if (currentLobby) {
        socket.join(currentLobby, () => {
            const lobby = lobbyManager.getLobbyPlayers(currentLobby);//need to implement this
            if (lobby) {
                socket.emit('lobbyPlayersUpdate', {
                    players: lobby.players.map(player => {
                        return {
                            userNameClock: player.userNameClock,
                            team: player.team,
                            alive: player.alive,
                            role: player.role
                        }
                    })
                })
            }
        })
    }
    //logic for usernames in lobby
    let userNameClock = '';
    const activeUsersLobby = {};// add an object to keep track of the users.
    socket.on('registerUser', (name, lobbyName) => {
        if (userNameClock) {
            //ignore if username is already set no registration
            return;
        }

        if (activeUsersLobby[name]) {
            socket.emit('registrationFailed', 'Name is already taken in this instance');
        } else {
            userNameClock = name;
            //i do not know why i am storing the socketID instead of their name for the users in the lobby. Should i change this? IMPORTANT
            activeUsersLobby[name] = { socketID: socket.id, lobby: lobbyName };
            socket.emit('registrationSuccess', 'Registered temporarily as ${name}');
            //debugging
            socket.on('getLobbies', () => { // Remove the 'socket' parameter here
                const currentLobbies = lobbyManager.getLobbies();
                socket.emit('lobbiesList', currentLobbies);
                console.log("current lobbie are ", currentLobbies);
                clock.to(lobbyName).emit('lobbyPlayersUpdate', { players: updatedPlayers });
                console.log("Did the registration successfully\n The lobby is ", currentLobbies, "did that print out ?");
                //show or broadcast the clients the list of players in the lobby
                //clock.emit(playesr)
            });
        }
    });

    socket.on('createLobby', (lobbyName) => {
        //im passing in userName to create the lobby, but they dont type in their username until they want to join the lobby?
        const lobbyId = lobbyManager.createLobby(socket, lobbyName, io);
        if (lobbyId) {
            console.log("creating lobby of ", lobbyName);
            console.log("lobby id is ", lobbyId);
            // After successfully creating a new lobby, fetch the updated list of lobbies
            const updatedLobbies = lobbyManager.getLobbies();
            // Broadcast the updated list of lobbies to all connected clients
            clock.emit('lobbiesList', updatedLobbies);
        } else {
            // Handle error, e.g., lobby name already taken
            socket.emit('lobbyCreationFailed', 'Lobby name already taken.');
        }
    });

    socket.on('requestCurrentLobbyState', ({ lobbyName }) => {
        const players = lobbyManager.getLobbyPlayers(lobbyName);
        const gameStarted = lobbyManager.getGameStarted(lobbyName);
        if (players) {
            socket.emit('lobbyPlayersUpdate', { players, gameStarted });
        }
    })

    // socket.on('playerMoved', ({ id, x, y, lobbyName }) => {
    //   // const lobbyName = lobbyManager.retrieveLobbyNameFromSocket(socket);
    //   // console.log(lobbyName, 'is the name of the lobby')
    //   const lobbies = lobbyManager.getLobbies();
    //   const lobby = lobbies.find(lobby => lobby.name === lobbyName);
    //   // console.log('our lobby is ', lobby);
    //   // console.log('the lobbies are',lobbies)
    //   if(!lobby){
    //     console.log('no lobby, returning');
    //     return;
    //   }
    //   const player = lobby.players.find(player => player.userNameClock === id);
    //   if(!player){
    //     console.log('no player, returning');
    //     return;
    //   }
    //   //update player positions
    //   player.x = x;
    //   player.y = y;
    //   //boradcast the player postion to all clients in lobby
    //   clock.to(lobbyName).emit('updatePlayerPosition', {id, x, y });
    // })

    socket.on('startGame', ({ lobbyName }) => {
        lobbyManager.startGame(lobbyName, io, 0);
        clock.to(lobbyName).emit('gameStarted', { gameStarted: true });
    })


    socket.on('getLobbies', () => { // Remove the 'socket' parameter here
        const currentLobbies = lobbyManager.getLobbies();
        socket.emit('lobbiesList', currentLobbies);
        // console.log("current lobbie are ", currentLobbies);
    });

    socket.on('joinLobby', ({ lobbyName, userNameClock }) => {
        const success = lobbyManager.joinLobby(socket, lobbyName, io, userNameClock);
        if (success) {
            console.log('successufly joined here');
            // Send confirmation back to the client
            console.log('username is ', userNameClock);
            socket.emit('joinLobby', { lobbyName: lobbyName, userNameClock: userNameClock });
            // Optionally, update all clients in the lobby
            clock.to(lobbyName).emit('lobbyUpdate', {/* lobby information */ });
            //get the updated players list from lobby lobbyManager
            const updatedPlayers = lobbyManager.getLobbyPlayers(lobbyName);

            clock.to(lobbyName).emit('lobbyPlayersUpdate', { players: updatedPlayers });
            clock.to(lobbyName).emit('lobbyPlayersUpdate', { players: updatedPlayers })
            console.log('upadted Players is ', updatedPlayers);

        } else {
            console.log('join was not succesful');
            // Joining the lobby was unsuccessful
            socket.emit('lobbyError', { message: 'Could not join the lobby.' });
        }
    });

    socket.on('nominate', ({ lobbyName, nominator, nominee }) => {
        const result = lobbyManager.nominatePlayer(lobbyName, nominator, nominee);
        //handle the result and send the confirmatino or error message back.
    });

    socket.on('vote', ({ lobbyName, voter, voteFor }) => {
        lobbyManager.vote(lobbyName, voter, voteFor);
        //maybe send a confiration back
    });

    socket.on('playerMoved', ({ id, x, y, lobbyName }) => {
        // const lobbyName = lobbyManager.retrieveLobbyNameFromSocket(socket);
        console.log(lobbyName, 'is the name of the lobby')
        const lobbies = lobbyManager.getLobbies();
        const lobby = lobbies.find(lobby => lobby.name === lobbyName);
        console.log('our lobby is ', lobby);
        console.log('the lobbies are', lobbies)
        if (!lobby) {
            console.log('no lobby, returning');
            return;
        }
        const player = lobby.players.find(player => player.userNameClock === id);
        if (!player) {
            console.log('no player, returning');
            return;
        }
        //update player positions
        player.x = x;
        player.y = y;
        //boradcast the player postion to all clients in lobby
        clock.to(lobbyName).emit('updatePlayerPosition', { id, x, y });
    })

    socket.on('startGame', ({ lobbyName }) => {
        lobbyManager.startGame(lobbyName, io, 0);
        clock.to(lobbyName).emit('gameStarted', { gameStarted: true });
    })
    socket.on('disconnect', () => {
        const disconnectTimeout = setTimeout(() => {
            const updatedLobbies = lobbyManager.deleteLobby(socket.id);
            clock.emit('lobbiesList', updatedLobbies);
            // Other disconnect logic...
        }, 10000); //wait ten seconds before deleting

        socket.on('reconnect', () => {
            //if they reconect clear the lobby to prevent deleting
            clearTimeout(disconnectTimeout);
        });
    });
});




const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));



