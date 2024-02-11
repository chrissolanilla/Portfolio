import { writable } from 'svelte/store';
import io from 'socket.io-client';

const createSocketStore = () => {
  const { subscribe, set } = writable(null);

  return {
    subscribe,
    connect: (backendURL) => {
      const socket = io(backendURL);
      set(socket);
      // Handle socket events here
    },
    disconnect: () => {
      set(null);
    }
  };
};

export const socketStore = createSocketStore();