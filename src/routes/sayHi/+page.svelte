<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import io from 'socket.io-client';
  
    let message = 'no initial message';
    let socket;
    let inputMessage = '';
    
    let userCount = 0; //reactive varible
    let messages= []; //array to store messages

    if (browser) {
      onMount(() => {
        const backendURL = import.meta.env.VITE_BACKEND_URL;
        socket = io(backendURL);
        //add functionalities of websockets
        socket.on('message', (msg) => {
            messages = [...messages, { text: msg, type: 'received' }]; //adds received messages to the list
        });

        socket.on('userCount', (data) => {
          userCount = data.count; //update user count here 
        })
      });
  
      onDestroy(() => {
        if (socket) {
          socket.disconnect();
        }
      });
    }
  
    // Function to send a message to the server
    function sendMessage() {
        if (socket && inputMessage.trim() !== '') {
            socket.emit('sendMessage', inputMessage);
            messages = [...messages, { text: 'You: ' + inputMessage, type: 'sent' }]; // Use 'sent' here
            inputMessage = ''; // Clear the input after sending
        }
    }
  </script>

  <h2>Users Connected: {userCount}</h2>
  
  <input type="text" bind:value={inputMessage} />
  <button on:click={sendMessage}>Send Message</button>
  
  <div>
    {#each messages as message}
    <p class={message.type}>{message.text}</p>
    {/each}
  </div>
  

<style>
    .sent {
      font-weight: bold;
      font-size: 50px;
      text-align: right;
      color: blue;
    }
  
    .received {
      font-weight: bold;
      font-size: 50px;
      text-align: left;
      color: green;
    }
</style>