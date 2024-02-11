import { writable } from 'svelte/store';
import io from 'socket.io-client';

const createSocketStore = () => {
  const { subscribe, set } = writable(null);

  return {
    subscribe,
    connect: (backendURL, namespace = '') => {
      const socket = io(`${backendURL}${namespace}`);
      set(socket);
    },
    disconnect: () => {
      set(null);
    }
  };
};

export const socketStore = createSocketStore();