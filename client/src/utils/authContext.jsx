import { createContext , useState, useEffect} from "react";
import Auth from "./auth";
import { io } from 'socket.io-client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [token, setToken] = useState(null);

    //TODO: delete this useEffect
    useEffect(() => {
        console.log('AuthContext user:', user);
    }, [user]);
    useEffect(() => {
        console.log('AuthContext loggedIn:', loggedIn);
    }, [loggedIn]);

    useEffect(() => {
        const savedToken = Auth.getToken();

        //TODO: delete this if statement
        if(savedToken && Auth.isTokenExpired(savedToken)){
            alert('Token expired');
        }
        setToken(prior => prior = savedToken);
        
        if(savedToken && !Auth.isTokenExpired(savedToken)){
            setUser(prior => prior = Auth.getProfile());
            console.log('savedToken:', savedToken);
            setToken(prior => savedToken);
            
            
        }
    }, [])

    useEffect(() => {
        console.log('token state: ', token);
        if(token && !Auth.isTokenExpired(token)){
            
            setUser(prior => prior = Auth.getProfile());
            setLoggedIn(prior => prior = Auth.loggedIn());
            Auth.login(token);
            //TODO: delete this console.log
            console.log('new token in useeffect:', token);
            console.log('is logged in:', Auth.loggedIn());
            console.log('token? ', token);
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
    }, [token])

    return (
        <AuthContext.Provider value={{ user, setUser, loggedIn, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
}

