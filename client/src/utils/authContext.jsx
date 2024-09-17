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
        
        if(savedToken && !Auth.isTokenExpired(savedToken)){
            setUser(Auth.getProfile());
            setToken(savedToken);
        }
    }, [])

    useEffect(() => {
        if(token && !Auth.isTokenExpired(token)){
            
            setUser(prior =>Auth.getProfile());
            setLoggedIn(prior => Auth.loggedIn());
            Auth.login(token);

            if(!socket){
                const newSocket = io('http://localhost:3001', {
                    auth: {
                        token: token,
                    },
                });
                setSocket(newSocket);
            }


            if(socket){
                socket.on('connect_error', (err) => {
                    console.error('Socket connection error:', err.message);
                });
            }
            return () => {
                if (socket) {
                    socket.disconnect();
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

