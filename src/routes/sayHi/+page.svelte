<script>
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    import io from 'socket.io-client'; 
    import { socketStore} from '../../stores/socketStore'
    
  
    //reference the chat container element
  let chatContainer;
  let autoScroll = true;
  let lastScrollTop = 0; // Variable to store the last scroll position.
  let scrollSum=100;
  let scrollSum2=100
  function onScroll() {
    const currentScrollTop = chatContainer.scrollTop;

    // Calculate the distance from the bottom of the chat container
    const distanceFromBottom = chatContainer.scrollHeight - chatContainer.clientHeight - currentScrollTop;

    // If the user scrolls up (current scroll position is less than the last), disable auto-scroll
    if (currentScrollTop > lastScrollTop+scrollSum) {
        autoScroll = false;
        scrollSum+=100;
    } else if (distanceFromBottom < scrollSum2) { // If the user is within 50px of the bottom, enable auto-scroll
        autoScroll = true;
        // scrollSum2+=10;
    }

    // Update the last scroll position
    lastScrollTop = currentScrollTop;
}


// Reactive statement to handle auto-scrolling.
  $: if (chatContainer && messages.length > 0 && autoScroll) {
      setTimeout(() => {
          chatContainer.scrollTop = chatContainer.scrollHeight;
      }, 0);
  }


  let message = 'no initial message';
  let socket;
  let inputMessage = '';

  let userNameChat = '';
  let registrationError = '';
  
  let userCountChat = 0; //supposed to be reactive
  let messages= []; //array to store messages

  let isRegistered = false; //add flag and set it true after regisration

  if (browser) {
    onMount(() => {
      const backendURL = import.meta.env.VITE_BACKEND_URL; // Adjust if needed
      socketStore.connect(backendURL, '/chat');

      const unsubscribe = socketStore.subscribe(socket => {
        if (socket) {
          socket.on('message', (messageObject) => {
            const formattedTime = new Date(messageObject.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            messages = [...messages, { ...messageObject, time: formattedTime }];
          });

          socket.on('userCountChat', (data) => {
            userCountChat = data.count;
            console.log('Updated user count: ', userCountChat);
          });

          socket.on('registrationSuccess', (msg) => {
            isRegistered = true;
          });

          socket.on('registrationFailed', (errorMsg) => {
            registrationError = errorMsg;
          });
        }
      });

      return () => {
        unsubscribe();
        socketStore.disconnect();
      };
    });
  }

  function registerUser() {
    if (userNameChat.trim() !== '') {
      socketStore.subscribe(socket => {
        if (socket) {
          socket.emit('registerUser', userNameChat);
          console.log(userCountChat);
        }
      })();
    }
  }

  function sendMessage() {
    if (inputMessage.trim() !== '') {
      socketStore.subscribe(socket => {
        if (socket) {
          const messageObject = {
            name: isRegistered ? userNameChat : 'Guest',
            text: inputMessage,
            timestamp: new Date().toISOString()
          };
          socket.emit('sendMessage', messageObject);
          inputMessage = '';
        }
      })();
    }
  }

  function handleEnterPress(event) {
    if (event.key === 'Enter') {
      sendMessage();
    }
  }
</script>

<input type="text" placeholder="Enter your name" bind:value={userNameChat}  disabled={isRegistered} class="input input-bordered input-primary w-full max-w-xs" />
<button on:click={registerUser} disabled={isRegistered} class="btn btn-primary" >Register</button>
{#if registrationError}
  <p style="color: red">{registrationError}</p>
{/if}

<h2>Users Connected: {userCountChat}</h2>


<!-- Chat interface -->
<div class="chat-containerChris" bind:this={chatContainer} on:scroll={onScroll} >
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
<div class="centerChris">
  <input type="text" bind:value={inputMessage}  class="input input-bordered input-secondary w-full max-w-xs" on:keydown={handleEnterPress}  />
  <button on:click={sendMessage} class="btn btn-secondary">Send Message</button>

</div>


<style>
  @import "../../app.css" ;
  .chat-containerChris {
    display: flex;
    flex-direction: column;
    max-width: 800px;
    max-height: 700px;
    overflow-y: auto;
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
    background: #bd93f9;
    color:white;
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
  .centerChris {
    display: flex;
    justify-content: center;
    gap: 10px;
    
  }
  
</style>