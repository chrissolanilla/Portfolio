<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import io from 'socket.io-client';
    import "../../app.css"
  
    let message = 'no initial message';
    let socket;
    let inputMessage = '';

    let userName = '';
    let registrationError = '';
    
    let userCount = 0; //reactive varible
    let messages= []; //array to store messages

    let isRegistered = false; //add flag and set it true after regisration

    if (browser) {
    onMount(() => {
      const backendURL = import.meta.env.VITE_BACKEND_URL;
      socket = io(backendURL);

      socket.on('message', (messageObject) => {
        const formattedTime = new Date(messageObject.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        messages = [...messages, { ...messageObject, time: formattedTime }];
      });

      socket.on('userCount', (data) => {
        userCount = data.count;
      });

      socket.on('registrationSuccess', (msg) => {
        // Handle successful registration
      });

      socket.on('registrationFailed', (errorMsg) => {
        registrationError = errorMsg; // Show error to the user
      });
    });

    onDestroy(() => {
      if (socket) {
        socket.disconnect();
      }
    });
  }

  function registerUser() {
    if (socket && userName.trim() !== '') {
      socket.emit('registerUser', userName);
      isRegistered = true; //set the flag to true after registration
    }
  }

  function sendMessage() {
  if (socket && inputMessage.trim() !== '') {
    const messageObject = {
      name: isRegistered ? userName : 'Guest',
      text: inputMessage,
      timestamp: new Date().toISOString() // Use ISO string for consistency
    };
    // Emit the message to the server without the 'type' property
    socket.emit('sendMessage', messageObject);
    // Don't push to messages array here; let the server confirm the message
    inputMessage = '';
  }
}
</script>

<input type="text" placeholder="Enter your name" bind:value={userName}  disabled={isRegistered} class="input input-bordered input-primary w-full max-w-xs" />
<button on:click={registerUser} disabled={isRegistered} class="btn btn-primary" >Register</button>
{#if registrationError}
  <p style="color: red">{registrationError}</p>
{/if}

<h2>Users Connected: {userCount}</h2>

<input type="text" bind:value={inputMessage}  class="input input-bordered input-secondary w-full max-w-xs"/>
<button on:click={sendMessage} class="btn btn-secondary">Send Message</button>

<!-- Chat interface -->
<div class="chat-containerChris">
  {#each messages as message}
    <div class={message.type === 'sent' ? 'chatChris chat-endChris' : 'chatChris chat-startChris'}>
      <div class="chat-headerChris">
        {message.type === 'sent' ? 'You' : message.name}
        <time class="text-xs opacity-50">{message.time || 'Just now'}</time>
      </div>
      <div class="chat-bubbleChris">{message.text}</div>
      <div class="chat-footerChris opacity-50">
        {message.type === 'sent' ? 'Delivered' : 'Seen'}
      </div>
    </div>
  {/each}
</div>


<style>
  .chat-containerChris {
    display: flex;
    flex-direction: column;
    max-width: 600px;
    margin: auto;
  }

  .chatChris {
    margin-bottom: 10px;
    padding: 10px;
  }

  .chat-headerChris {
    font-weight: bold;
    margin-bottom: 5px;
  }

  .chat-bubbleChris {
    position: relative;
    padding: 10px;
    border-radius: 16px;
    background: #bd93f9;;
    max-width: 70%;
  }

  .chat-endChris .chat-bubbleChris {
    margin-left: auto;
    background: #7c9fff;
    color: white;
  }

  .chat-footerChris {
    font-size: 0.75rem;
    text-align: right;
  }

  .chat-startChris .chat-footerChris {
    text-align: left;
  }
</style>