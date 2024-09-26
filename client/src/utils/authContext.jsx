import { createContext , useState, useEffect} from "react";
import Auth from "./auth";
//import socket.io-client
import { io } from 'socket.io-client'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [socket, setSocket] = useState(null)


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
            //initialize up socket connection
            if(!socket){
                const newSocket = io('http://localhost:3001', {
                    auth: {
                        token: token
                    }
                })
                setSocket(newSocket)
            }
            return () => {
                if(socket){
                    socket.disconnect()
                }
            }
        }
    }, [token])

    useEffect(() => {
        if(socket){
            socket.on('connect', () => {
                console.log('connected!')
            })
            socket.on('hello', () => {
                console.log('i see you, server!')
            })
            socket.emit('hello')
        }
        //clean up event listeners
        return () => {
            if(socket){
                socket.off('connect')
                socket.off('hello')
            }
        }
    }, [socket])


    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken, socket }}>
            {children}
        </AuthContext.Provider>
    );
}

