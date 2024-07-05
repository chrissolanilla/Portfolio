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
        //messaging in the game hopefully stays for individual lobbies
        socket.on('sendMessageClock', (messageObject, lobbyName) => {
            const lobbies = lobbyManager.getLobbies();
            const lobby = lobbies.find(lobby => lobby.name === lobbyName);
            if (!lobby) return;
            const message = messageObject;
            clock.to(lobbyName).emit('showMessage', message);
        });

        socket.on('startGame', ({ lobbyName }) => {
            lobbyManager.startGame(lobbyName, io, 0);
            startCountdown(lobbyName, 20, 'day');
            clock.to(lobbyName).emit('gameStarted', { gameStarted: true });
        });

        socket.on('goToNextDay', ({ lobbyName, nextDay }) => {
            const lobbies = lobbyManager.getLobbies();
            const lobby = lobbies.find(lobby => lobby.name === lobbyName);
            if (!lobby) return;
            //validate first if we already recieved this call
            console.log("our current day before if statement is ", lobby.day);
            if (!lobby.isDayTransitionInProgress) {
                lobby.isDayTransitionInProgress = true;
                if (nextDay === lobby.day + 1) {
                    lobby.day += 1;
                    clock.to(lobbyName).emit('nextDay', lobby.day);
                    console.log("AFter next day our lobby.day is ", lobby.day);
                    lobby.isNight = false;
                    startCountdown(lobbyName, 20, 'day');
                }
                setTimeout(() => {
                    lobby.isDayTransitionInProgress = false;
                }, 1000);
            }
        });

        socket.on("startNightTimer", ({ nightStarted, lobbyName }) => {
            const lobbies = lobbyManager.getLobbies();
            const lobby = lobbies.find(lobby => lobby.name === lobbyName);
            if (!lobby) return;
            if (lobby.isDayTransitionInProgress) return;
            lobby.isDayTransitionInProgress = true;
            //set the lobby night time attribute boolean to true
            lobby.isNight = nightStarted;
            console.log("the current lobby is night", lobby.isNight);
            startCountdown(lobbyName, 10, 'night');
            setTimeout(() => {
                lobby.isDayTransitionInProgress = false;
            }, 1000);
        });
        function startCountdown(lobbyName, duration, dayStatus) {
            let timeLeft = duration;
            const interval = setInterval(() => {
                console.log(timeLeft, " seconds left");
                if (timeLeft <= 0) {
                    console.log("day parameter is ", dayStatus)
                    clearInterval(interval);
                    clock.to(lobbyName).emit('timerFinished');
                    if (dayStatus === 'day') {
                        //go to night time and then start the next day.
                        console.log("going to night time...");
                        clock.to(lobbyName).emit('getDayNightStatus', true);
                    }
                    else if (dayStatus === 'night') {
                        clock.to(lobbyName).emit('getDayNightStatus', false);
                        console.log("going to day(next day) time...");
                    }
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

