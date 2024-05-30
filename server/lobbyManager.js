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
      isNight: false,
      nominations: [],
      votes: {}, 
      votingInProgress: false,
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
    // console.log('the value of playesrs array is ' , lobby.players);
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
    lobby.isNight = true; //start with night time 
    lobby.day = 1; //start with day 1.

    // Now you need to emit these positions to all clients in the lobby
    io.of('/clock').to(lobbyName).emit('initializePlayers', lobby.players);
    console.log(`Emitted initializePlayers for lobby: ${lobbyName}`);
    startDayNightCycle(lobbyName, io);
    //this recursive thing is so that the server has time to put the players all the spots. 
    if(flag===0){
      setTimeout( () => {
        startGame(lobbyName, io, 1)
      },30000)
    }
    else return
}

function startDayNightCycle(lobbyName, io){
  const lobby = lobbies[lobbyName];
  if (!lobby || !lobby.gameStarted) return; //return if there is no lobby or if it is not started. 
  // toggle between night and day
  lobby.isNight = !lobby.isNight; 
  //if its day increment the day count 
  if(!lobby.isNight){
    lobby.day++;
    console.log(lobby.day)
    //check for a game end condition
    if(lobby.day > 6) {
      //end game logic
      io.of('/clock').to(lobbyName).emit('gameEnd', { winner: 'Determine winner here..'});// the winner should be either the good or bad team.
      return;
      //bad team should win if two good players are dead. 
    }
  }
  //broadcast the update to all clients in the lobby]
  io.of('/clock').to(lobbyName).emit('dayNightUpdate', {
    isNight: lobby.isNight,
    day: lobby.day
  });
  //continue the cycle after a delay 
  setTimeout(() => {
        startDayNightCycle(lobbyName, io);
    }, 10000); // 10 seconds for each day/night cycle, adjust as needed
  }

  function nominatePlayer( lobbyName, nominator, nominee) {
    const lobby = lobbies[lobbyName];
    if(!lobby || lobby.phase !== 'nomination') return;
     //ensure nominee hasnt been nominated this day already
     if(lobby.nominations.include(nominee)) {
      return { success: false, message: 'Player already nominated' };
     }
     //broad cast the nomination for voting
     lobby.nominations.push({nominator, nominee});
     io.of('/clock').to(lobbyName).emit('nomination', { nominator, nominee });
     //start voting period
     lobby.votingInProgress = true;
     setTimeout( () => {
      tallyVotes(lobbyName);
      lobby.votingInProgress = false;
     }, 30000); //30 second voting time.
  }

  function vote(lobbyName, voter, voteFor){
    const lobby = lobbies[lobbyName];
    if (!lobby || lobby.phase !== 'voting') return;
    //vote logic
    lobby.votes[voter] = voteFor; 
    //check if all votes are in to tally
    if(Object.keys(lobby.votes).length === lobby.players.length) {
      tallyVotes(lobbyName);
    }
  }

  function tallyVotes(lobbyName) {
    const lobby = lobbies[lobbyName];
    //some tally logic

    //broadcast results 
    io.of('/clock').to(lobbyName).emit('votingResults', results);
    //transcription to night or next phase

  }


module.exports = { createLobby, joinLobby, leaveLobby, getLobbies, deleteLobby, getLobbyPlayers, retrieveLobbyNameFromSocket, getGameStarted, startGame, nominatePlayer, vote};
