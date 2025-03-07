import { useState, createContext, useReducer, useEffect } from 'react'
import io from 'socket.io-client'
import { useUserContext } from '../hooks/useUserContext';

export const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { user } = useUserContext()
    useEffect(() => {
        const socket = io.connect("http://localhost:8000");
        socket.emit("join_room","123");
        setSocket(socket);

        return () => {
            socket.disconnect();
        };

    }, []);


    const contextValue = {
        socket
    };

    return (
        <SocketContext.Provider value={ contextValue }>
            {children}
        </SocketContext.Provider>
    );
};