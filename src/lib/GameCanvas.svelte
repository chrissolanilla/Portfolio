<script>
    import { onMount } from 'svelte';
    export let players = []; 
  
    let canvas;
    let ctx;
  
    onMount(() => {
      ctx = canvas.getContext('2d');
      drawBackground();
      drawPlayers();
      // Listen for keyboard events to move the player
      window.addEventListener('keydown', handleKeyDown);
  
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    });
  
    function drawBackground() {
      const background = new Image();
      background.src = '/background.png'; // Update this path
      background.onload = () => {
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      };
    }
  
    function drawPlayers() {
      players.forEach(player => {
        const avatar = new Image();
        avatar.src = player.avatar; // Path to player's avatar
        avatar.onload = () => {
          ctx.drawImage(avatar, player.x, player.y, 50, 50); // Adjust size as needed
        };
      });
    }
  
    function handleKeyDown(event) {
        const player = players[0]; // Example: move the first player in the array
        const movementSpeed = 5;
        console.log(movementSpeed)
  
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
          player.y -= movementSpeed;
          break;
        case 'ArrowDown':
        case 's':
          player.y += movementSpeed;
          break;
        case 'ArrowLeft':
        case 'a':
          player.x -= movementSpeed;
          break;
        case 'ArrowRight':
        case 'd':
          player.x += movementSpeed;
          break;
      }
      console.log('player x is ', player.x)
      console.log('player y is ', player.y)
      redrawCanvas();
    }
  
    function redrawCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
      drawBackground(); // Redraw the background
      drawPlayers(); // Redraw the players
    }
  </script>
  
  <canvas bind:this={canvas} width="1700" height="1080"></canvas> <!-- Adjust size as needed -->
  