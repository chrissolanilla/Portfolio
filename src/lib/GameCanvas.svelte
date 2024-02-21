<script>
    import { onMount } from 'svelte';
    import { socketStore } from '../stores/socketStore';
    export let players = []; 
    export let socket;
    export let currentUserNameClock;
    export let lobbyName;
  
    let canvas;
    let ctx;
    let x=0;
    let y=0;

  
    onMount(() => {
      ctx = canvas.getContext('2d');
      drawBackground();
      drawPlayers();
      socket.on('updatePlayerPosition', ({id, x, y}) => {
        const playerIndex = players.findIndex(player => player.userNameClock === id);
        if (playerIndex === -1) return;
        players[playerIndex].x = x;
        players[playerIndex].y  = y;

        redrawCanvas();
      })
      // Listen for keyboard events to move the player
      window.addEventListener('keydown', handleKeyDown);
  
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
          y -= movementSpeed;
          currentPlayer.y = y;
          break;
        case 'ArrowDown':
        case 's':
          y += movementSpeed;
          currentPlayer.y = y;
          break;
        case 'ArrowLeft':
        case 'a':
          x -= movementSpeed;
          currentPlayer.x =x;
          break;
        case 'ArrowRight':
        case 'd':
          x += movementSpeed;
          currentPlayer.x = x
          break;
      }

      socket.emit('playerMoved', {id: currentPlayer.userNameClock, x: currentPlayer.x, y: currentPlayer.y, lobbyName: lobbyName });
      console.log('player x is ', currentPlayer.x)
      console.log('player y is ', currentPlayer.y)
      redrawCanvas();
    }
  
    function redrawCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); 
      drawBackground();
      drawPlayers(); 
    }
  </script>
  
  <canvas bind:this={canvas} width="1700 " height="1080"></canvas> <!-- Adjust size as needed -->
  