import { createContext , useState, useEffect} from "react";
import Auth from "./auth";
//import socket.io-client



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);


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
 
        }
    }, [token])


    return (
        <AuthContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
}

