import { createContext, useEffect, useState } from 'react';
import { connectSocket, disconnectSocket } from '../services/socket.js';
import { useAuth } from '../hooks/useAuth.js';

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !token) return undefined;

    const s = connectSocket(token);
    setSocket(s);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    s.on('connect', onConnect);
    s.on('disconnect', onDisconnect);

    return () => {
      s.off('connect', onConnect);
      s.off('disconnect', onDisconnect);
      disconnectSocket();
      setSocket(null);
      setIsConnected(false);
    };
  }, [isAuthenticated, token]);

  return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
};
