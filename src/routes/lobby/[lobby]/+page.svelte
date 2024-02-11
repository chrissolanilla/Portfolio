<script>
    import { onMount } from 'svelte';
    import { socketStore } from '../../../stores/socketStore.js'
    import { page } from '$app/stores';
    let lobbyName='';
    let socket;
    let userNameClock = '';
    let isRegistered = false;
    let registrationError = false;
    let players = [];

    onMount(() => {
      lobbyName = $page.params.lobby;
      socketStore.subscribe(value => {
          socket = value;
          if (socket) {
              socket.on('lobbyPlayersUpdate', ({ players: updatedPlayers }) => {
                console.log('testing if this code runs after lobbyPlayersUpdate');
                  // Map over the updatedPlayers array to extract only the usernames
                  players = updatedPlayers.map(player => player.userNameClock);
              });
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
    }


    function joinLobby() {
        if (socket && isRegistered) {
            // Ensure the object structure matches what the server expects
            console.log('joining ',lobbyName, 'from the client side');
            socket.emit('joinLobby', { lobbyName, userNameClock });
        }
    }

  </script>
<h1>Welcome to {lobbyName}'s Lobby</h1>

<input type="text" placeholder="Enter your name" bind:value={userNameClock} disabled={isRegistered} class="input input-bordered input-primary w-full max-w-xs" />
<button on:click={registerUser} disabled={isRegistered} class="btn btn-primary">Join Lobby with User Name</button>
{#if registrationError}
  <p style="color: red">{registrationError}</p>
{/if}

<h2>Players in Lobby:</h2>
<ul>
  {#each players as player}
    <li>{player}</li>
  {/each}
</ul>

