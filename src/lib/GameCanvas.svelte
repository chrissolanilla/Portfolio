<script>
  import { onMount } from 'svelte';
  import { socketStore } from '../stores/socketStore';
  import { updated } from '$app/stores';
  export let players = []; 
  export let socket;
  export let currentUserNameClock;
  export let lobbyName;

  let ctx;
  let clientRole = '';
  let dayOrNight = 'Night';

  let showNominationModal = false;
  let nominations = []; // updated from the socket event. 
  let selectedNominee = null;
  const keysPressed = new Set();
  const movementSpeed = 5;

  // Make a class for the player
  class Player {
    constructor(nameC, teamC, aliveC, roleC, xC, yC, avatarC, socketID_C) {
      this.nameC = nameC;
      this.teamC = teamC;
      this.aliveC = aliveC;
      this.roleC = roleC;
      this.xC = xC;
      this.yC = yC;
      this.avatarC = avatarC;
      this.socketID_C = socketID_C;
    }

    draw(ctx) {
      // Temporarily use circles for drawing players for testing
      ctx.beginPath();
      ctx.arc(this.xC, this.yC, 25, 0, 2 * Math.PI);
      ctx.fillStyle = "blue";
      ctx.fill();
      ctx.stroke();
    }

    move(direction) {
      switch (direction) {
        case 'up':
          this.yC -= movementSpeed;
          break;
        case 'down':
          this.yC += movementSpeed;
          break;
        case 'left':
          this.xC -= movementSpeed;
          break;
        case 'right':
          this.xC += movementSpeed;
          break;
      }
    }
  }

  onMount(() => {
    let canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    let window_height = window.innerHeight;
    let window_width = window.innerWidth;
    canvas.width = window_width / 1.2;
    canvas.height = window_height;
    drawBackground();
    drawPlayers();

    // WebSocket stuff
    socket.on('updatePlayerPosition', ({ id, x, y }) => {
      const playerIndex = players.findIndex(player => player.userNameClock === id);
      if (playerIndex === -1) return;
      console.log(`Updating position for ${id}: x=${x}, y=${y}`);
      players[playerIndex].xC = x;
      players[playerIndex].yC = y;

      redrawCanvas();
    });

    // Get starting positions
    socket.on('initializePlayers', (playersData) => {
      players = playersData.map(playerData => new Player(
        playerData.userNameClock, 
        playerData.team, 
        playerData.alive, 
        playerData.role, 
        playerData.x, 
        playerData.y, 
        playerData.avatar, 
        playerData.socketID
      ));
      redrawCanvas();
    });

    console.log('Client ready and listening for initializePlayers event');
    // Listen for keyboard events to move the player
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    socket.on('roleAssigned', ({ role, team }) => {
      console.log('Role:', role, 'Team:', team);
      clientRole = role;
    });

    socket.on('dayNightUpdate', ({ isNight, day }) => {
      dayOrNight = isNight ? 'Night' : 'Day';
      redrawCanvas();
    });

    socket.on('nomination', (data) => {
      nominations.push(data.nominee);
      showNominationModal = true;
    });

    const gameLoop = () => {
      updatePlayerPosition();
      requestAnimationFrame(gameLoop);
    };
    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  });

  function handleKeyDown(event) {
    console.log('Key down:', event.key);
    keysPressed.add(event.key);
  }

  function handleKeyUp(event) {
    console.log('Key up:', event.key);
    keysPressed.delete(event.key);
  }

  function updatePlayerPosition() {
    const currentPlayer = players.find(player => player.userNameClock === currentUserNameClock);
    if (!currentPlayer) return;

    if (keysPressed.has('ArrowUp') || keysPressed.has('w')) {
      currentPlayer.move('up');
    }
    if (keysPressed.has('ArrowDown') || keysPressed.has('s')) {
      currentPlayer.move('down');
    }
    if (keysPressed.has('ArrowLeft') || keysPressed.has('a')) {
      currentPlayer.move('left');
    }
    if (keysPressed.has('ArrowRight') || keysPressed.has('d')) {
      currentPlayer.move('right');
    }

    socket.emit('playerMoved', { id: currentPlayer.userNameClock, x: currentPlayer.xC, y: currentPlayer.yC, lobbyName });
    redrawCanvas();
  }

  function nominate() {
    socket.emit('nominate', { nominee: selectedNominee });
    showNominationModal = false;
  }

  function drawBackground() {
    const background = new Image();
    background.src = '/background.png';
    background.onload = () => {
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    };
  }

  function drawPlayers() {
    for (let i = 0; i < players.length; i++) {
      if (players[i] instanceof Player) {
        console.log(`Drawing player ${players[i].nameC} at (${players[i].xC}, ${players[i].yC})`);
        players[i].draw(ctx);
      }
    }
  }

  function redrawCanvas() {
    console.log('Redrawing canvas with players:', players);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPlayers();
  }

  function buttonShow() {
    showNominationModal = !showNominationModal;
    console.log(showNominationModal);
  }
</script>

<h1>Your role is {clientRole}.</h1>
<h1 class="dayNight text-center">It is currently {dayOrNight}</h1>
<button on:click={buttonShow}>Show the modal</button>
{#if showNominationModal}
  <div class="modalChris">
    <h2>Nominate a player</h2>
    <select bind:value={selectedNominee}>
      {#each players as player}
        {#if !nominations.includes(player.userNameClock)}
          <option value={player.userNameClock}>{player.userNameClock}</option>
        {/if}
      {/each}
    </select>
    <button on:click={nominate}>Nominate</button>
  </div>
{/if}
<canvas id="canvas"></canvas>

<style lang="postcss">
  @font-face {
    font-family: 'CloisterBlack';
    src: url('/CloisterBlack.ttf') format('truetype');
  }
  .dayNight {
    font-family: 'CloisterBlack';
    font-size: 12rem;
  }
  canvas {
    margin: 0 auto;
    margin-bottom: 3rem;
    margin-top: 3rem;
  }
  footer {
    margin: 1 0rem;
    padding: 1rem;
    background-color: black;
  }
  .footercontainer {
    display: flex;
    justify-content: center;
  }
</style>
