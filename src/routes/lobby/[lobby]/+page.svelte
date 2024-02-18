<script>
    import { onMount } from 'svelte';
    import { socketStore } from '../../../stores/socketStore.js'
    import { page } from '$app/stores';
    import { writable } from 'svelte/store';
    import GameCanvas from '$lib/GameCanvas.svelte'
    let lobbyName='';
    let socket;
    let userNameClock = '';
    let isRegistered = false;
    let registrationError = false;
    let players = writable([]);
    let gameStartedVar = false;

    onMount(() => {
        lobbyName = $page.params.lobby;
        const backendURL = import.meta.env.VITE_BACKEND_URL+'/clock';//connect to the namespace
        console.log(backendURL);
        socketStore.connect(backendURL);
        socketStore.subscribe(value => {
            socket = value;
            if (socket) {
                //requst the current players when connecting to the page and also get the varible of gameStarted
                socket.emit('requestCurrentLobbyState', ({ lobbyName }));
                //update when we register
                socket.on('lobbyPlayersUpdate', ({ players: updatedPlayers , gameStarted }) => {
                    console.log('Updated players:', updatedPlayers);
                    console.log('testing if this runs')
                    players.set(updatedPlayers); // Trigger reactivity by assigning a new array
                    gameStartedVar = gameStarted
                });

                socket.on('gameStarted', ({ gameStarted}) => {
                    gameStartedVar = gameStarted
                })
            }
        });
    });

    
    function registerUser() {
        console.log(userNameClock);
        if (socket && userNameClock.trim() !== '') {
            socket.emit('registerUser', userNameClock); // Emit the registerUser event with userName
            
            // Listen for registration success response from the server
            socket.once('registrationSuccess', () => {
                isRegistered = true;
                joinLobby(); // Call joinLobby only after successful registration
            });

            // Optionally, listen for a registration failure response to handle errors
            socket.once('registrationFailed', (errorMsg) => {
                registrationError = errorMsg;
            });
        }

        //this adds the username from the input to the lobby but it dosent add it for everyone, i also want to get the entire object from the server instead also. 
        
    }


    function joinLobby() {
        if (socket && isRegistered) {
            // Ensure the object structure matches what the server expects
            console.log('joining ',lobbyName, 'from the client side');
            socket.emit('joinLobby', { lobbyName, userNameClock });
        }
    }

    function getPlayers() {
        let currentPlayers;
        players.subscribe(value => {
            currentPlayers = value;
        })(); // Immediately invoke the function returned by subscribe to unsubscribe
        console.log(currentPlayers);
    }

    function startGame(){
        if(socket) {
            //emit even tot send to server
            socket.emit('startGame', { lobbyName});
        }
    }

    function getGameStarted(){
        console.log(gameStartedVar)
    }
  </script>
<h1>Welcome to {lobbyName}'s Lobby</h1>

{#if !gameStartedVar}
    <input type="text" placeholder="Enter your name" bind:value={userNameClock} disabled={isRegistered} class="input input-bordered input-primary w-full max-w-xs" />
    <button on:click={registerUser} disabled={isRegistered} class="btn btn-primary">Join Lobby with User Name</button>
    {#if registrationError}
    <p style="color: red">{registrationError}</p>
    {/if}
    {:else}
    <h1>Game has started</h1>

{/if}


<h2>Players in Lobby:</h2>
<ul>
  {#each $players as player}
  <li>{player.userNameClock} - Alive: {player.alive ? 'Yes' : 'No'}, Role: {player.role} ?</li>
  {/each}
</ul>
<!--check if the player name matches the host of the lobby-->
{#if userNameClock && !gameStartedVar }
    <button class="btn btn-secondary" on:click={startGame}> Start Game</button>
{/if}
{#if gameStartedVar}
    <GameCanvas players={$players} />
{/if}
<button class="btn btn-primary" on:click={getGameStarted}>Get Game</button>



