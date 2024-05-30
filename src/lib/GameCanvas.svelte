<script>
  import { onMount } from 'svelte';
  import { socketStore } from '../stores/socketStore';
  export let players = []; 
  export let socket;
  export let currentUserNameClock;
  export let lobbyName;

  let ctx;
  let clientRole = '';
  let dayOrNight = 'Night';

  let showNominationModal = false;
  let nominations = []; //upated from the socket event. 
  let selectedNominee = null;



  onMount(() => {
    let canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    let window_height = window.innerHeight;
    let window_width = window.innerWidth;
    canvas.width = window_width/1.2;
    canvas.height  = window_height;
    
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

    socket.on('dayNightUpdate', ({ isNight, day }) => {
      //update the day/night display badsed on the isNightFlag
      dayOrNight = isNight ? 'Night': 'Day';
      //upate any counter display like number of day
      //handle specific day/night specific logic here...
      redrawCanvas();
    })

    socket.on('nomination', (data)=> {
      nominations.push(data.nominee);
      showNominationModal = true;
    })
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };


  });

  function nominate() {
    //emit nomnation event
    socket.emit('nominate', {nominee: selectedNominee });
    showNominationModal = false;
  }

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

  function buttonShow(){
    showNominationModal = !showNominationModal;
    console.log(showNominationModal)
  }
</script>
  
  <h1> your role is {clientRole}.</h1>
  <h1 class = "dayNight text-center">It is currently {dayOrNight}</h1>
  <button on:click={buttonShow}>Show the modal</button>
  {#if showNominationModal}
    <div class ="modalChris" >
      <h2>Nominate a player</h2>
      <select bind:value={selectedNominee}>
        {#each players as player}
          {#if !nominations.includes(player.userNameClock)}
            <option value={player.userNameClock}> {player.userNameClock}</option>
          {/if}
        {/each}
      </select>
      <button on:click={nominate}>Nominate</button>
    </div>
  {/if}
  <canvas id="canvas"> </canvas> <!-- Adjust size as needed -->
  <footer>
    <div class="footercontainer">
      <h2>This is my footer</h2>

    </div>
  </footer>
  <style lang="postcss">
    @font-face {
      font-family: 'CloisterBlack';
      src: url('/CloisterBlack.ttf') format('truetype');
    }
    .dayNight{
      font-family: 'CloisterBlack' ; 
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
  