import { createContext , useState, useEffect} from "react";
import Auth from "./auth";
import { io } from 'socket.io-client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const savedToken = Auth.getToken();
        setToken(prior => prior = savedToken);
        
        if(savedToken && !Auth.isTokenExpired(savedToken)){
            setUser(prior => prior = Auth.getProfile());
            setToken(prior => savedToken);
            
            
        }
    }, [])

    useEffect(() => {
        if(token && !Auth.isTokenExpired(token)){
            
            setUser(prior => prior = Auth.getProfile());
            setLoggedIn(prior => prior = Auth.loggedIn());
            Auth.login(token);

            const newSocket = io('http://localhost:3001', {
                auth: {
                    token: token,
                },
            });
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
    }, [token])

    return (
        <AuthContext.Provider value={{ user, setUser, loggedIn, token, setToken, socket }}>
            {children}
        </AuthContext.Provider>
    );
}

