import { createContext , useState, useEffect} from "react";
import Auth from "./auth";
import { io } from 'socket.io-client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [socket, setSocket] = useState(null);

    //TODO: delete this useEffect
    useEffect(() => {
        console.log('AuthContext user:', user);
    }, [user]);

    useEffect(() => {
        const token = Auth.getToken();
        if(token && !Auth.isTokenExpired(token)){
            setUser(Auth.getProfile());

            const newSocket = io('http://localhost:3001', {
                auth: {
                    token: token,
                },
            });
            console.log('newSocket:', newSocket);
            setSocket(newSocket);

            // Handle connection errors
            newSocket.on('connect_error', (err) => {
                console.error('Socket connection error:', err.message);
            });

            // Clean up the socket when the component unmounts or user logs out
            return () => {
                if (newSocket) {
                    newSocket.disconnect();
                }
            };
            
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

