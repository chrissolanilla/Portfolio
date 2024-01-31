const lobbies = {};

function createLobby(socket, lobbyName) {
    // Check if the lobby name already exists
    if (lobbies[lobbyName]) {
      return null; // Lobby name already taken, return null or handle this case appropriately
    }
  
    // Create a new lobby with the given name
    lobbies[lobbyName] = {
      name: lobbyName,
      owner: socket.id,
      players: [socket.id],
      gameStarted: false,
    };
  
    return lobbyName; // Return the lobby name as its unique identifier
  }
  
function joinLobby(socket, lobbyName) {
    const lobby = lobbies[lobbyName];
    if (lobby && !lobby.gameStarted && !lobby.players.includes(socket.id)) {
        lobby.players.push(socket.id);
        // Additional join logic...
    }
}

function leaveLobby(socket, lobbyName) {
    const lobby = lobbies[lobbyName];
    if (lobby) {
        lobby.players = lobby.players.filter(playerId => playerId !== socket.id);
        // Additional leave logic...
        if (lobby.players.length === 0) {
        // If no players are left in the lobby, destroy it
        delete lobbies[lobbyName];
        }
    }
}
  

function getLobbies() {
    return Object.values(lobbies); // Convert the lobbies object to an array
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


module.exports = { createLobby, joinLobby, leaveLobby, getLobbies, deleteLobby };
