/**
 * @typedef {object} Player
 * @property {string} userNameClock
 * @property {string} team
 * @property {boolean} alive
 * @property {string} role
 * @property {number} x
 * @property {number} y
 * @property {string} avatar
 * @property {string} socketID
 */

/**
 * @typedef {object} Lobby
 * @property {string} name
 * @property {string} owner
 * @property {Player[]} players
 * @property {boolean} gameStarted
 * @property {number} day
 */

const lobbies = {};

/**
 * @param {object} socket
 * @param {string} lobbyName
 * @param {object} io
 * @returns {string|null}
 */
function createLobby(socket, lobbyName, io) {
    if (lobbies[lobbyName]) {
        return null;
    }
    /** @type {Lobby} */
    const newLobby = {
        name: lobbyName,
        owner: socket.id,
        players: [],
        gameStarted: false,
        day: 0,
    };
    lobbies[lobbyName] = newLobby;
    io.to(socket.id).emit('lobbyWelcome', { gameName: lobbyName });
    return lobbyName;
}

/**
 * @param {object} socket
 * @param {string} lobbyName
 * @param {object} io
 * @param {string} userNameClock
 * @returns {boolean}
 */
function joinLobby(socket, lobbyName, io, userNameClock) {
    console.log(`Attempting to join lobby: ${lobbyName} with userName: ${userNameClock}`);
    const lobby = lobbies[lobbyName];

    if (!lobby || lobby.gameStarted || lobby.players.some(player => player.userNameClock === userNameClock)) {
        return false;
    }

    /** @type {Player} */
    const newPlayer = {
        userNameClock,
        team: "",
        alive: true,
        role: "",
        x: 100,
        y: 100,
        avatar: '/default.svg',
        socketID: socket.id,
    };
    lobby.players.push(newPlayer);

    socket.join(lobbyName, () => {
        io.to(lobbyName).emit('lobbyPlayersUpdate', {
            players: lobby.players.map(player => ({
                userNameClock: player.userNameClock,
                team: player.team,
                alive: player.alive,
                role: player.role,
                x: player.x,
                y: player.y,
                avatar: player.avatar
            }))
        });
    });

    return true;
}

/**
 * @param {string} lobbyName
 * @param {object} io
 * @param {number} flag
 */
function startGame(lobbyName, io, flag) {
    const lobby = lobbies[lobbyName];
    if (!lobby) return;

    lobby.players = assignRoles(lobby.players);
    lobby.players.forEach(player => {
        const playerSocket = io.of('/clock').sockets.get(player.socketID);
        if (playerSocket) {
            playerSocket.emit('roleAssigned', {
                role: player.role,
                team: player.team
            });
        }
    });
    const centerX = 850;
    const centerY = 540;
    const radius = 100;
    lobby.players.forEach((player, index, playersArray) => {
        const angle = (index / playersArray.length) * 2 * Math.PI;
        player.x = centerX + radius * Math.cos(angle);
        player.y = centerY + radius * Math.sin(angle);
        console.log(`Initial position for ${player.userNameClock}: x=${player.x}, y=${player.y}`);
    });
    lobby.gameStarted = true;
    io.of('/clock').to(lobbyName).emit('initializePlayers', lobby.players);
    if (flag === 0) {
        setTimeout(() => {
            startGame(lobbyName, io, 1);
        }, 10000);
    }
}

/**
 * @param {object} socket
 * @param {object} io
 * @param {object} position
 * @param {string} position.id
 * @param {number} position.x
 * @param {number} position.y
 * @param {string} position.lobbyName
 */
// function updatePlayerPosition(socket, io, { id, x, y, lobbyName }) {
//     const lobby = lobbies[lobbyName];
//     if (!lobby) return;
//
//     const player = lobby.players.find(player => player.userNameClock === id);
//     if (!player) return;
//
//     player.x = x;
//     player.y = y;
//     console.log("Sending player position to lobby: ", lobbyName, "player: ", id, "x: ", x, "y: ", y);
//     io.of('/clock').to(lobbyName).emit('updatePlayerPosition', { id, x, y });
// }

/**
 * @param {object} socket
 * @param {string} lobbyName
 */
function leaveLobby(socket, lobbyName) {
    const lobby = lobbies[lobbyName];
    if (lobby) {
        lobby.players = lobby.players.filter(player => player.socketID !== socket.id);

        const updatedPlayers = lobby.players.map(player => player.userNameClock);
        io.to(lobbyName).emit('lobbyPlayersUpdate', { players: updatedPlayers });

        if (lobby.players.length === 0) {
            delete lobbies[lobbyName];
        }
    }
}

/**
 * @returns {Lobby[]}
 */
function getLobbies() {
    return Object.values(lobbies); // Convert the lobbies object to an array
}

/**
 * @param {string} lobbyName
 * @returns {Player[]}
 */
function getLobbyPlayers(lobbyName) {
    const lobby = lobbies[lobbyName];
    if (lobby && lobby.players) {
        console.log('the value of players array is ', lobby.players);
        return lobby.players;
    } else {
        return [];
    }
}

/**
 * @param {string} socketId
 * @returns {Lobby[]}
 */
function deleteLobby(socketId) {
    Object.keys(lobbies).forEach(lobbyName => {
        const lobby = lobbies[lobbyName];
        if (lobby.owner === socketId) {
            delete lobbies[lobbyName];
        }
    });

    return Object.values(lobbies);
}

/**
 * @param {object} socket
 * @returns {string}
 */
function retrieveLobbyNameFromSocket(socket) {
    return socket.handshake.query.lobbyName;
}

/**
 * @param {string} lobbyName
 * @returns {boolean}
 */
function getGameStarted(lobbyName) {
    const lobby = lobbies[lobbyName];
    if (lobby) {
        return lobby.gameStarted;
    } else {
        return false; // Default to false if the lobby doesn't exist
    }
}

/**
 * @param {Player[]} players
 * @returns {Player[]}
 */
function assignRoles(players) {
    const shuffledPlayers = players.sort(() => 0.5 - Math.random());
    shuffledPlayers[0].role = 'Leviathan';
    shuffledPlayers[0].team = 'EvilTeam';
    shuffledPlayers[1].role = 'Goblin';
    shuffledPlayers[1].team = 'EvilTeam';

    for (let i = 2; i < shuffledPlayers.length; i++) {
        shuffledPlayers[i].role = 'Good';
        shuffledPlayers[i].team = 'GoodTeam';
    }

    return shuffledPlayers;
}

module.exports = {
    createLobby,
    joinLobby,
    leaveLobby,
    getLobbies,
    deleteLobby,
    getLobbyPlayers,
    retrieveLobbyNameFromSocket,
    getGameStarted,
    startGame,
};

