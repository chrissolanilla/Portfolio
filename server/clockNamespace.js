export function handleClockNamespace(io, lobbyManager) {
    const clock = io.of('/clock');
    clock.on('connection', (socket) => {
        console.log("User Connected to Clock");

        let currentLobby = lobbyManager.retrieveLobbyNameFromSocket(socket);
        if (currentLobby) {
            socket.join(currentLobby, () => {
                const lobby = lobbyManager.getLobbyPlayers(currentLobby);
                if (lobby) {
                    socket.emit('lobbyPlayersUpdate', {
                        players: lobby.players.map(player => ({
                            userNameClock: player.userNameClock,
                            team: player.team,
                            alive: player.alive,
                            role: player.role
                        }))
                    });
                }
            });
        }

        let userNameClock = '';
        const activeUsersLobby = {};

        socket.on('registerUser', (name, lobbyName) => {
            if (userNameClock) {
                return;
            }

            if (activeUsersLobby[name]) {
                socket.emit('registrationFailed', 'Name is already taken in this instance');
            } else {
                userNameClock = name;
                activeUsersLobby[name] = { socketID: socket.id, lobby: lobbyName };
                socket.emit('registrationSuccess', `Registered temporarily as ${name}`);
                socket.on('getLobbies', () => {
                    const currentLobbies = lobbyManager.getLobbies();
                    socket.emit('lobbiesList', currentLobbies);
                    console.log("current lobbie are ", currentLobbies);
                });
            }
        });

        socket.on('createLobby', (lobbyName) => {
            const lobbyId = lobbyManager.createLobby(socket, lobbyName, io);
            if (lobbyId) {
                const updatedLobbies = lobbyManager.getLobbies();
                clock.emit('lobbiesList', updatedLobbies);
            } else {
                socket.emit('lobbyCreationFailed', 'Lobby name already taken.');
            }
        });

        socket.on('requestCurrentLobbyState', ({ lobbyName }) => {
            const players = lobbyManager.getLobbyPlayers(lobbyName);
            const gameStarted = lobbyManager.getGameStarted(lobbyName);
            if (players) {
                socket.emit('lobbyPlayersUpdate', { players, gameStarted });
            }
        });

        socket.on('startGame', ({ lobbyName }) => {
            lobbyManager.startGame(lobbyName, io, 0);
            startCountdown(lobbyName, 20);
            clock.to(lobbyName).emit('gameStarted', { gameStarted: true });
        });
        function startCountdown(lobbyName, duration) {
            let timeLeft = duration;
            const interval = setInterval(() => {
                if (timeLeft <= 0) {
                    clearInterval(interval);
                    clock.to(lobbyName).emit('timerFinished');
                } else {
                    clock.to(lobbyName).emit('timerUpdate', { timeLeft });
                    timeLeft -= 1;
                }
            }, 1000)
        }


        socket.on('getLobbies', () => {
            const currentLobbies = lobbyManager.getLobbies();
            socket.emit('lobbiesList', currentLobbies);
        });

        socket.on('joinLobby', ({ lobbyName, userNameClock }) => {
            const success = lobbyManager.joinLobby(socket, lobbyName, io, userNameClock);
            if (success) {
                socket.emit('joinLobby', { lobbyName, userNameClock });
                const updatedPlayers = lobbyManager.getLobbyPlayers(lobbyName);
                clock.to(lobbyName).emit('lobbyPlayersUpdate', { players: updatedPlayers });
            } else {
                socket.emit('lobbyError', { message: 'Could not join the lobby.' });
            }
        });

        socket.on('nominate', ({ lobbyName, nominator, nominee }) => {
            lobbyManager.nominatePlayer(lobbyName, nominator, nominee);
        });

        socket.on('vote', ({ lobbyName, voter, voteFor }) => {
            lobbyManager.vote(lobbyName, voter, voteFor);
        });

        socket.on('playerMoved', ({ id, x, y, lobbyName }) => {
            const lobbies = lobbyManager.getLobbies();
            const lobby = lobbies.find(lobby => lobby.name === lobbyName);
            if (!lobby) return;

            const player = lobby.players.find(player => player.userNameClock === id);
            if (!player) return;

            player.x = x;
            player.y = y;
            clock.to(lobbyName).emit('updatePlayerPosition', { id, x, y });
        });


        //get what day it is, probalby some socket.on next day or next night

        socket.on('disconnect', () => {
            const disconnectTimeout = setTimeout(() => {
                const updatedLobbies = lobbyManager.deleteLobby(socket.id);
                clock.emit('lobbiesList', updatedLobbies);
            }, 10000);

            socket.on('reconnect', () => {
                clearTimeout(disconnectTimeout);
            });
        });
    });
}

