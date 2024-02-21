const lobbies = {};
function createLobby(socket, lobbyName, io) {
    // Check if the lobby name already exists
    if (lobbies[lobbyName]) {
      return null; // Lobby name already taken, return null or handle this case appropriately
    }
  
    // Create a new lobby with the given name
    lobbies[lobbyName] = {
      name: lobbyName,
      owner: socket.id,
      players: [],//initialize as empty first
      gameStarted: false,
    };
    io.to(socket.id).emit('lobbyWelcome', { gameName: lobbyName });
    return lobbyName; // Return the lobby name as its unique identifier
  }
  
  function joinLobby(socket, lobbyName, io, userNameClock) {
    console.log(`Attempting to join lobby: ${lobbyName} with userName: ${userNameClock}`);
    const lobby = lobbies[lobbyName];
  
    if (!lobby) {
      console.log(`Lobby ${lobbyName} does not exist.`);
      return false;
    }
  
    if (lobby.gameStarted) {
      console.log(`Lobby ${lobbyName} has already started the game.`);
      return false;
    }
  
    const isUserInLobby = lobby.players.some(player => player.userNameClock === userNameClock);
    if (isUserInLobby) {
      console.log(`User ${userNameClock} is already in lobby ${lobbyName}.`);
      return false;
    }
  
    lobby.players.push({
      userNameClock: userNameClock,
      team: "", // This can be assigned later
      alive: true,
      role: "", // This can be assigned later
      x: "",
      y: "",
      avatar: '/default.svg'
    });
  
    // After adding the new player to the lobby
    socket.join(lobbyName, () => {
      // Emit to all clients in the lobby room
      io.to(lobbyName).emit('lobbyPlayersUpdate', {
        players: lobby.players.map(player => {
          return {
            userNameClock: player.userNameClock,
            team: player.team,
            alive: player.alive,
            role: player.role,
            x:player.x,
            y: player.y,
            avatar: player.avatar
          };
        })
      });
    });

    console.log(`User ${userNameClock} successfully joined lobby ${lobbyName}:`, lobby.players);
    return true;
  }
  

  function leaveLobby(socket, lobbyName) {
    const lobby = lobbies[lobbyName];
    if (lobby) {
        // Remove the player based on their socket ID
        lobby.players = lobby.players.filter(player => player.socketID !== socket.id);

        // Emit the updated player list to all clients in the lobby
        const updatedPlayers = lobby.players.map(player => player.userNameClock); // Extract only the usernames
        io.to(lobbyName).emit('lobbyPlayersUpdate', { players: updatedPlayers });

        // Destroy the lobby if no players are left
        if (lobby.players.length === 0) {
            delete lobbies[lobbyName];
        }
    }
}
  

function getLobbies() {
    
    return Object.values(lobbies); // Convert the lobbies object to an array
}

function getLobbyPlayers(lobbyName){
  const lobby = lobbies[lobbyName];
  if (lobby && lobby.players) {
    console.log('the value of playesrs array is ' , lobby.players);
    return lobby.players;
  }
  else {
    return [];
  }
  // return Object.values(lobbies[lobbyName].players);
}

function deleteLobby(socketId) {
    Object.keys(lobbies).forEach(lobbyName => {
        const lobby = lobbies[lobbyName];
        if (lobby.owner === socketId) {
            delete lobbies[lobbyName];
        }
    });

    return Object.values(lobbies);
}

function retrieveLobbyNameFromSocket(socket) {
  return socket.handshake.query.lobbyName;
}

function getGameStarted(lobbyName){
  const lobby = lobbies[lobbyName];
    if (lobby) {
        return lobby.gameStarted;
    } else {
        return false; // Default to false if the lobby doesn't exist
    }
}

function startGame(lobbyName) {
  if (lobbies[lobbyName]) {
      lobbies[lobbyName].gameStarted = true;
  }
}

module.exports = { createLobby, joinLobby, leaveLobby, getLobbies, deleteLobby, getLobbyPlayers, retrieveLobbyNameFromSocket, getGameStarted, startGame};
