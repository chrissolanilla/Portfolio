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
      day: 0,
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
      x: 100,
      y: 100,
      avatar: '/default.svg',
      socketID: socket.id// may need to store this for showing each player their specific role. 
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

function assignRoles(players) {
  const shuffledPlayers= players.sort( () => 0.5 - Math.random() );
  //assign the leviathan and goblin role to the first two players and the rest specific roles maybe. Maybe change this function later by passing in a ruleset.
  shuffledPlayers[0].role = 'Leviathan';
  shuffledPlayers[0].team = 'EvilTeam'
  shuffledPlayers[1].role = 'Goblin';
  shuffledPlayers[1.].team = 'EvilTeam';
  //assign the Good roles to the rest of the players, each role needs to be different but for now give them a default role. 
  for (let i = 2; i< shuffledPlayers.length; i++){
    shuffledPlayers[i].role = 'Good';
    shuffledPlayers[i].team = 'GoodTeam'
  }

  return shuffledPlayers;
}

function startGame(lobbyName, io, flag) {
  const lobby = lobbies[lobbyName];
    if (!lobby) return;

    //assign the roles for the players
    lobby.players = assignRoles(lobby.players);
    //emit the roles to the players
    lobby.players.forEach(player => {
      const playerSocket = io.of('/clock').sockets.get(player.socketID);
      if(playerSocket){
        playerSocket.emit('roleAssigned', {
          role: player.role,
          team: player.team
        });
      }
    });
    const centerX = 850; // Half of your canvas width
    const centerY = 540; // Half of your canvas height
    const radius = 100; // Adjust based on your needs
    console.log('Starting game in lobby:', lobbyName);
    lobby.players.forEach((player, index, playersArray) => {
        const angle = (index / playersArray.length) * 2 * Math.PI;
        player.x = centerX + radius * Math.cos(angle);
        player.y = centerY + radius * Math.sin(angle);
        console.log(`Initial position for ${player.userNameClock}: x=${player.x}, y=${player.y}`);
    });
    lobby.gameStarted = true;
    // Now you need to emit these positions to all clients in the lobby
    io.of('/clock').to(lobbyName).emit('initializePlayers', lobby.players);
    console.log(`Emitted initializePlayers for lobby: ${lobbyName}`);
    if(flag===0){
      setTimeout( () => {
        startGame(lobbyName, io, 1)
      },10000)
    }
    else return
}

module.exports = { createLobby, joinLobby, leaveLobby, getLobbies, deleteLobby, getLobbyPlayers, retrieveLobbyNameFromSocket, getGameStarted, startGame};
