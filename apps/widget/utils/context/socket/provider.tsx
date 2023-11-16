import { useRef } from 'react';
import { io } from 'socket.io-client';
import env from 'utils/constants/env';
import { SocketContext } from './context';

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({
  children,
}: SocketProviderProps): JSX.Element => {
  const socketRef = useRef(
    io(env.nextPublicApiBaseUrl, { autoConnect: false })
  );

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};
