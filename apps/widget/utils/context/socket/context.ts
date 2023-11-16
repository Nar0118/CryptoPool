import { createContext, useContext } from 'react';
import { Socket } from 'socket.io-client';

export interface SocketContext {
  socket: Socket;
}

export const SocketContext = createContext<SocketContext>({} as SocketContext);

export const useSocketContext = () => useContext(SocketContext);
