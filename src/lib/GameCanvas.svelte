<script>
    import { onMount } from 'svelte';
    import { socketStore } from '../stores/socketStore';
    export let players = []; 
    export let socket;
    export let currentUserNameClock;
    export let lobbyName;
  
    let canvas;
    let ctx;
    let clientRole = '';


  
    onMount(() => {
      ctx = canvas.getContext('2d');
      drawBackground();
      drawPlayers();
      socket.on('updatePlayerPosition', ({id, x, y}) => {
        const playerIndex = players.findIndex(player => player.userNameClock === id);
        if (playerIndex === -1) return;
        console.log(`Updating position for ${id}: x=${x}, y=${y}`);
        players[playerIndex].x = x;
        players[playerIndex].y  = y;

        redrawCanvas();
      })
      //get starting possitons
      socket.on('initializePlayers', (playersData) => {
        console.log('Received initializePlayers:', playersData); //this does not run
        players = playersData; //update the local player array with the positions
        redrawCanvas();
      });
      console.log('Client ready and listeninig for initializePlayers event') //this runs
      // Listen for keyboard events to move the player
      window.addEventListener('keydown', handleKeyDown);
  
      socket.on('roleAssigned', ({ role, team }) => {
        console.log('Role:', role, 'Team: ', team);
        clientRole = role;
      })
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };


    });
  
    function drawBackground() {
      const background = new Image();
      background.src = '/background.png'; 
      background.onload = () => {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      };
    }

    function spawnPlayers(players, canvasWidth, canvasHeight) {
      const centerX = canvasWidth/2;
      const centerY = canvasHeight/2;
      const radius = 100;// adjust this if needed
      players.forEach( (player, index) => {
        const totalPlayers = player.length;
        const angle = (index / totalPlayers) * 2 * Math.PI; 

        player.x = centerX + radius * Math.cos(angle);
        player.y = centerY + radius * Math.sin(angle);
      })
    }
  
    function drawPlayers() {
      players.forEach(player => {
        const avatar = new Image();
        avatar.src =player.avatar; 
        avatar.onload = () => {
          ctx.drawImage(avatar, player.x, player.y, 50, 50); 
        };
      });
    }
  
    function handleKeyDown(event) {
        //somehow get the currentPlayerId
        const currentPlayer = players.find(player=> player.userNameClock === currentUserNameClock);
        if(!currentPlayer) return; // make sure the current player is found? do nothing when spectating the game i guess.  
        const movementSpeed = 5;
        console.log(movementSpeed)
  
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
          currentPlayer.y -=movementSpeed;
          break;
        case 'ArrowDown':
        case 's':
          currentPlayer.y += movementSpeed;
          break;
        case 'ArrowLeft':
        case 'a':
          currentPlayer.x -= movementSpeed;
          break;
        case 'ArrowRight':
        case 'd':
          currentPlayer.x += movementSpeed
          break;
      }

      socket.emit('playerMoved', {id: currentPlayer.userNameClock, x: currentPlayer.x, y: currentPlayer.y, lobbyName: lobbyName });
      console.log('player x is ', currentPlayer.x)
      console.log('player y is ', currentPlayer.y)
      redrawCanvas();
    }
  
    function redrawCanvas() {
      console.log('Redrawing canvas with players:', players);
      ctx.clearRect(0, 0, canvas.width, canvas.height); 
      drawBackground();
      drawPlayers(); 
    }
  </script>
  
  <canvas bind:this={canvas} width="1700 " height="1080"></canvas> <!-- Adjust size as needed -->
  <h1> your role is {clientRole}.</h1>
  