import { createContext , useState, useEffect} from "react";
import Auth from "./auth";
//import socket.io-client
import { io } from 'socket.io-client';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [socket, setSocket] =useState(null)

    useEffect(() => {
        const savedToken = Auth.getToken();
        
        if(savedToken && !Auth.isTokenExpired(savedToken)){
            setUser(Auth.getProfile());
            setToken(savedToken);
        }
    }, [])

    //set up useEffect to handle sockets any time token state is altered
    useEffect(() => {
        if(token && !Auth.isTokenExpired(token)){
            //using the function form of setUser to avoid stale closure
            setUser(() => Auth.getProfile());
            Auth.login(token);
            //set up socket connection
            if(!socket){
                const newSocket = io('http://localhost:3001', {
                    auth: {
                        token: token,
                    },
                    
                });
                newSocket.on('connect_error', (err) => {
                    console.error('Socket connection error:', err.message);
                });
                setSocket((prior) => newSocket);
                
            }
            
            return () => {
                if (socket) {
                    socket.disconnect();
                }
            };
 
        }
    }, [token])


    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken, socket }}>
            {children}
        </AuthContext.Provider>
    );
}

