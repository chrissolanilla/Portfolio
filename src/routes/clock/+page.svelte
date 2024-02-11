<script>
    import { onMount } from 'svelte';
    import io from 'socket.io-client';
    import "../../app.css"
    import { browser } from '$app/environment';
    import {socketStore} from '../../stores/socketStore'

    let errMsg = '';
    let socket;
    let lobbies = []; //array to store lobbies
    let gameName = '';
    if(browser){

        onMount(() => {
            const backendURL = import.meta.env.VITE_BACKEND_URL;//connect to the namespace
            socketStore.connect(backendURL);
            socketStore.subscribe(value => {
                socket = value;
                //moving all socket event listeners inside the subscribe?
                socket = io(backendURL);
        
                socket.emit('getLobbies'); // Request the list of lobbies
        
                socket.on('lobbiesList', (receivedLobbies) => {
                    lobbies = receivedLobbies;
                });
    
                socket.on('lobbyCreated', (newLobby) => {
                    //when new lobby created make it reactive
                    lobbies = [...lobbies, newLobby];
                })
        
                // Function to join a lobby
                
                // Additional functions for creating lobbies, leaving lobbies, etc.
                socket.on('lobbyCreationFailed', (message) => {
                    errMsg = message; // Update the errorMessage with the received message
                    // Optionally, clear the message after a delay
                    setTimeout(() => errMsg = '', 3000); // Clears the error message after 3 seconds
                });
            })

        });
    }
    
    function joinLobby(lobbyId) {
        socket.emit('joinLobby', lobbyId);
    }
    
    function createLobby(event) {
        event.preventDefault(); // Prevent the default form submission
        socket.emit('createLobby', gameName); // Use the gameName state variable as the lobby name
        gameName = ''; // Optionally, clear the input after submitting
    }
</script>

<div class="container-class flex flex-col w-full lg:flex-row lg:items-stretch">
    <div class={`public-lobbies-card flex-grow card bg-base-300 rounded-box flex flex-col justify-center ''}`}>
        <h1 class="m-1 text-center"><i class="fas fa-users"></i> Public Lobbies</h1>
        <div class="p-5 text-center">
            {#each lobbies as lobby}
                <a href={`/lobby/${lobby.name}`} class="btn btn-outline btn-accent m-2">{lobby.name}</a>
            {/each}
          </div>
          
    </div>

    <div class="divider lg:divider-horizontal">
        <h2 class="p-1">OR</h2>
    </div>

    <div class={`create-a-lobby-class flex-grow card bg-base-300 rounded-box flex flex-col justify-center ''}`}>
        <h1 class="m-1 text-center"><i class="fas fa-plus-circle"></i> Create a Lobby</h1>
        <div class="inner-create-lobby-container flex flex-col items-center">
            <form class="form-control" on:submit={createLobby}>
              <label for="gameName" class="label text-xl">Name of Lobby:</label>
              <input bind:value={gameName} id="gameName" type="text" placeholder="Type here" class="input input-bordered input-primary w-full max-w-xs" />
              <button type="submit" class="btn btn-primary m-2">Create Lobby</button>
              {#if errMsg}
                <p class="error-message" >{errMsg}</p>
              {/if}
            </form>
          </div>
    </div>
</div>

<style>
    .error-message {
      color: red;
      text-align: center;
      margin-top: 1rem;
    }
  </style>