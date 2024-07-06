<script>
  import { onMount } from 'svelte';
  /** @type {Array<{userNameClock: string, x: number, y: number, avatar: string}>} */
  export let players = [];
  /** @type {import('socket.io-client').Socket} */
  export let socket;
  /** @type {string} */
  export let currentUserNameClock;
  /** @type {string} */
  export let lobbyName;
  /** @type {CanvasRenderingContext2D} */
  let ctx;
  let clientRole = '';
  const movementSpeed = 5;
  let backgroundImageLoaded = false;
  const backgroundImage = new Image();
  backgroundImage.src = '/background.png';
  let currentDay = 0;
  let isNight = false;
  let timeLeft = 0;
  let timerRunning = false;
  let gameOver = false;
  const avatars = {}; // Store preloaded avatars
  /** @type {null | {x: number, y: number}} */
  let lastPosition = { x: null, y: null };
  function gameLoop() {
    let positionChagned = false;
    if (window.heldKeys) {
      const currentPlayer = players.find(
        (player) => player.userNameClock === currentUserNameClock,
      );
      if (currentPlayer) {
        if (window.heldKeys['w']) {
          currentPlayer.y -= movementSpeed;
          positionChagned = true;
        }
        if (window.heldKeys['s']) {
          currentPlayer.y += movementSpeed;
          positionChagned = true;
        }
        if (window.heldKeys['a']) {
          currentPlayer.x -= movementSpeed;
          positionChagned = true;
        }
        if (window.heldKeys['d']) {
          currentPlayer.x += movementSpeed;
          positionChagned = true;
        }
        if (positionChagned) {
          socket.emit('playerMoved', {
            id: currentPlayer.userNameClock,
            x: currentPlayer.x,
            y: currentPlayer.y,
            lobbyName: lobbyName,
          });
          lastPosition = { x: currentPlayer.x, y: currentPlayer.y };
        }
      }
    }
    redrawCanvas();
    requestAnimationFrame(gameLoop);
  }

  function drawBackground() {
    // console.log("Drawing background");
    if (backgroundImageLoaded) {
      ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
      ctx.fillStyle = '#ADD8E6'; // Light blue background color
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  function drawPlayers() {
    // console.log("Drawing players:", players);
    players.forEach((player) => {
      const avatar = avatars[player.userNameClock];
      if (avatar) {
        ctx.drawImage(avatar, player.x, player.y, 50, 50);
        // console.log(`Drew player at x: ${player.x}, y: ${player.y}`);
      }
    });
  }

  function preloadAvatars() {
    players.forEach((player) => {
      const avatar = new Image();
      avatar.src = player.avatar;
      avatar.onload = () => {
        avatars[player.userNameClock] = avatar;
        console.log(`Preloaded avatar for player: ${player.userNameClock}`);
      };
    });
  }

  function redrawCanvas() {
    // console.log("Redrawing canvas");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawPlayers();
  }

  onMount(() => {
    /** @type {HTMLCanvasElement} */
    let canvas = document.getElementById('canvas');
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;
    canvas.width = windowWidth / 1.2;
    canvas.height = windowHeight;
    ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('Failed to get canvas context');
      return;
    }
    // console.log("Canvas context initialized");

    window.heldKeys = {}; // Track the held keys

    backgroundImage.onload = () => {
      backgroundImageLoaded = true;
      // console.log("Background image loaded");
      redrawCanvas(); // Ensure the background is drawn once it is loaded
    };

    socket.on('updatePlayerPosition', ({ id, x, y }) => {
      const playerIndex = players.findIndex(
        (player) => player.userNameClock === id,
      );
      if (playerIndex === -1) return;
      players[playerIndex].x = x;
      players[playerIndex].y = y;
      redrawCanvas();
    });

    socket.on('initializePlayers', (playersData) => {
      // console.log("Initializing players:", playersData);
      players = playersData;
      preloadAvatars(); // Preload avatars when players are initialized
      redrawCanvas();
    });

    socket.on('firstDay', (dayNumber) => {
      console.log('current day is: ', dayNumber);
      currentDay = dayNumber;
    });
    socket.on('nextDay', (dayNumber) => {
      console.log('going to the next day');
      currentDay = dayNumber;
    });
    socket.on('getDayNightStatus', (nightBoolean) => {
      console.log('it is currently', nightBoolean);
      isNight = nightBoolean;
      if (isNight === true) {
        //initiate the timer that is the same for day time
        socket.emit('startNightTimer', {
          nightStarted: true,
          lobbyName: lobbyName,
        });
      }
    });

    socket.on('timerUpdate', ({ timeLeft: updatedTimeLeft }) => {
      timeLeft = updatedTimeLeft;
      timerRunning = true;
    });

    socket.on('timerFinished', () => {
      timerRunning = false;
      if (isNight) {
        //send the event to change it to next day
        socket.emit('goToNextDay', {
          lobbyName: lobbyName,
          nextDay: currentDay + 1,
        });
      } else {
        //that means its day time so we go to night time
        socket.emit('goToNightTime', { lobbyName: lobbyName });
      }
    });

    socket.on('gameOver', () => {
      gameOver = true;
    });

    socket.on('showMessage', (messageObject) => {
      const formattedTime = new Date(
        messageObject.timestamp,
      ).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      messages = [...messages, { ...messageObject, time: formattedTime }];
    });

    window.addEventListener('keydown', (event) => {
      window.heldKeys[event.key] = true;
    });

    window.addEventListener('keyup', (event) => {
      delete window.heldKeys[event.key];
    });

    gameLoop();

    socket.on('roleAssigned', ({ role, team }) => {
      clientRole = role;
    });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  });
  let message = 'No initial message';
  let inputMessage = '';
  let messages = [];

  function sendMessage() {
    if (inputMessage.trim() !== '') {
      const messageObject = {
        name: currentUserNameClock,
        text: inputMessage,
        timestamp: new Date().toISOString(),
      };
      socket.emit('sendMessageClock', messageObject, lobbyName);
      console.log(messageObject);
      inputMessage = '';
    }
  }

  function handleEnterPress(event) {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }
</script>

<style>
  canvas {
    margin: 0 auto;
    margin-bottom: 3rem;
    margin-top: 3rem;
    border: 5px;
  }
  .centerChris {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
  .chat-containerChris {
    display: flex;
    flex-direction: column-reverse;
    max-width: 400px;
    max-height: 700px;
    overflow-y: auto;
  }
</style>

<h1>The current day is {currentDay}</h1>
{#if timerRunning}
  <h1>Time left: {timeLeft}</h1>
{/if}
<h1>Night status {isNight}</h1>
{#if !gameOver}
  <div class="flex align-center">
    <canvas id="canvas"></canvas>
    <!-- some simple chat box for players to talk -->
    <!-- Chat interface -->
    <div class="BeforeRowREverse">
      <div class="chat-containerChris">
        <div class="flex flex-col">
          {#each messages as message}
            <div class="flex gap-2">
              <div class="">
                {message.type === 'sent' ? 'You' : message.name + ': '}
              </div>
              <div class="">{message.text}</div>
              <time class="text-xs opacity-50"
                >{message.time || 'Just now'}</time
              >
            </div>
          {/each}
        </div>
      </div>
      <div class="centerChris">
        <input
          type="text"
          bind:value="{inputMessage}"
          class="input input-bordered input-secondary w-full max-w-xs"
          on:keydown="{handleEnterPress}"
        />
        <button on:click="{sendMessage}" class="btn btn-secondary"
          >Send Message</button
        >
      </div>
    </div>
  </div>
{:else}
  <h1>The game is over... {gameOver}</h1>
{/if}
<h1>your role is {clientRole}.</h1>

<footer>
  <div class="footercontainer">
    <h2>This is my footer</h2>
  </div>
</footer>
